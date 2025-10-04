import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import L from "leaflet";
// Heatmap layer
function HeatmapLayer({ data }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !data.length) return;

    const heatLayer = (window.L).heatLayer(
      data.map(stop => [stop.lat, stop.lng, stop.avg_delay / 10]),
      { radius: 25, blur: 15, maxZoom: 17 }
    );

    map.addLayer(heatLayer);
    return () => map.removeLayer(heatLayer);
  }, [map, data]);

  return null;
}

// Move map when a stop is selected
function MapController({ selectedStop }) {
  const map = useMap();

  useEffect(() => {
    if (selectedStop) {
      map.setView([selectedStop.lat, selectedStop.lng], 15);
    }
  }, [map, selectedStop]);

  return null;
}

// Function to determine the color based on delay
const getHeatmapColor = (delay) => {
  if (delay <= 3) {
    return "green"; // Low delay
  } else if (delay <= 6) {
    return "yellow"; // Moderate delay
  } else {
    return "red"; // High delay
  }
};

export default function BusHeatmap() {
  const [busData, setBusData] = useState([]);
  const [lines, setLines] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]); // Add filteredRoutes state
  const [stops, setStops] = useState([]);
  const [selectedLine, setSelectedLine] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedStop, setSelectedStop] = useState(null);

  useEffect(() => {
    // Fetch lines and routes
    const fetchRoutes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/routes/");
        const data = await response.json();
        const formattedLines = data.results.map(route => ({
          lineNumber: route.lineNumber,
          routeId: route.routeId,
          startStop: route.startStop,
          endStop: route.endStop,
        }));

        // Generate both route combinations
        const formattedRoutes = formattedLines.flatMap(route => [
          { ...route, displayName: `${route.startStop} - ${route.endStop}` },
          { ...route, displayName: `${route.endStop} - ${route.startStop}` },
        ]);

        setLines([...new Set(formattedLines.map(line => line.lineNumber))]);
        setRoutes(formattedRoutes);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    // Fetch stops
    const fetchStops = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/stops/");
        const data = await response.json();
        const formattedStops = data.results.map(stop => ({
          name: stop.name,
          lat: stop.lat,
          lng: stop.lon,
        }));
        setStops(formattedStops);
      } catch (error) {
        console.error("Error fetching stops:", error);
      }
    };

    fetchRoutes();
    fetchStops();
  }, []);

  // Update filtered routes when selectedLine changes
  useEffect(() => {
    if (selectedLine) {
       
      const filtered = routes.filter(route => String(route.lineNumber) === selectedLine);
      console.log(routes,selectedLine);
      setFilteredRoutes(filtered);
    } else {
      setFilteredRoutes([]);
    }
  }, [selectedLine, routes]);

  useEffect(() => {
    const fetchStopsForRoute = async () => {
      if (!selectedRoute) {
        setStops([]); // Clear stops if no route is selected
        return;
      }

      try {
        // Find the route object based on the selectedRoute displayName
        const route = routes.find(route => route.displayName === selectedRoute);

        if (!route) {
          setStops([]); // Clear stops if no matching route is found
          return;
        }

        // Fetch trips for the route
        const tripsResponse = await fetch(`http://127.0.0.1:8000/api/trips/`);
        const tripsData = await tripsResponse.json();

        // Filter trips by routeId and endStop
        const matchingTrips = tripsData.results.filter(
          trip => trip.route === route.routeId && trip.endStop === route.endStop
        );

        if (!matchingTrips.length) {
          setStops([]); // Clear stops if no matching trips are found
          return;
        }

        // Add random delay to stops
        const stopTimesForTrips = [];
        for (const trip of matchingTrips) {
          try {
            const stopTimesResponse = await fetch(`http://127.0.0.1:8000/api/stop-times/by_trip/?trip_id=${trip.tripId}`);
            const stopTimesData = await stopTimesResponse.json();

            // Check if the response is an array
            if (!Array.isArray(stopTimesData)) {
              console.error(`Unexpected response format for trip ${trip.tripId}:`, stopTimesData);
              continue; // Skip this trip if the response is invalid
            }

            // Push stop times into the array with random delay
            stopTimesForTrips.push(
              ...stopTimesData.map(stopTime => ({
                name: stopTime.stop_info.name,
                lat: stopTime.stop_info.lat,
                lng: stopTime.stop_info.lon,
                expectedTime: stopTime.expectedTime,
                delay: Math.floor(Math.random() * 10) + 1, // Generate random delay between 1 and 10 minutes
              }))
            );
          } catch (error) {
            console.error(`Error fetching stop times for trip ${trip.tripId}:`, error);
          }
        }

        // Group stop times by stop name
        const groupedStops = stopTimesForTrips.reduce((acc, stop) => {
          if (!acc[stop.name]) {
            acc[stop.name] = [];
          }
          acc[stop.name].push(stop);
          return acc;
        }, {});

        // Find the closest time for each unique stop name
        const uniqueStops = Object.values(groupedStops).map(stops => {
          const currentTime = new Date();

          // Find the stop with the closest time in the future
          const closestStop = stops.reduce((closest, stop) => {
            const stopTimeDate = new Date();
            const [hours, minutes, seconds] = stop.expectedTime.split(":").map(Number);
            stopTimeDate.setHours(hours, minutes, seconds);

            if (stopTimeDate > currentTime) {
              if (!closest) {
                return stop;
              }

              const closestTimeDate = new Date();
              const [closestHours, closestMinutes, closestSeconds] = closest.expectedTime.split(":").map(Number);
              closestTimeDate.setHours(closestHours, closestMinutes, closestSeconds);

              return stopTimeDate < closestTimeDate ? stop : closest;
            }

            return closest;
          }, null);

          return closestStop;
        }).filter(Boolean); // Remove any null values (stops with no future times)

        // Set the unique stops
        setStops(uniqueStops);
      } catch (error) {
        console.error("Error fetching stops for route:", error);
        setStops([]); // Clear stops on error
      }
    };

    fetchStopsForRoute();
  }, [selectedRoute, routes]); // Add dependencies to refresh data when route or direction changes

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      {/* Control Panel */}
      <div style={{
        position: "absolute",
        top: 10,
        left: 100,
        background: "white",
        padding: "10px",
        borderRadius: "8px",
        zIndex: 1000,
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
      }}>
        <div>
          <label>Line: </label>
          <select value={selectedLine} onChange={e => {
            setSelectedLine(e.target.value);
            setSelectedRoute("");
            setSelectedStop(null);
          }}>
            <option value="">Select line</option>
            {lines.map(line => <option key={line} value={line}>{line}</option>)}
          </select>
        </div>

        {selectedLine && (
          <div>
            <label>Route: </label>
            <select value={selectedRoute} onChange={e => {
              setSelectedRoute(e.target.value);
              setSelectedStop(null);
            }}>
              <option value="">Select route</option>
              {filteredRoutes.map(route => (
                <option key={route.routeId + route.displayName} value={route.displayName}>
                  {route.displayName}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedRoute && (
          <div>
            <label>Stop: </label>
            <select
              value={selectedStop?.name || ""}
              onChange={e => {
                const stop = stops.find(s => s.name === e.target.value);
                setSelectedStop(stop);
              }}
            >
              <option value="">Select stop</option>
              {stops.map(stop => (
                <option key={`${stop.name}-${stop.lat}-${stop.lng}`} value={stop.name}>
                  {stop.name} (Expected: {stop.expectedTime})
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                const currentTime = new Date();
                const nearestStop = stops
                  .filter(stop => {
                    const stopTime = new Date();
                    const [hours, minutes, seconds] = stop.expectedTime.split(":").map(Number);
                    stopTime.setHours(hours, minutes, seconds);
                    return stopTime > currentTime; // Only consider stops in the future
                  })
                  .sort((a, b) => {
                    const timeA = new Date();
                    const timeB = new Date();
                    const [hoursA, minutesA, secondsA] = a.expectedTime.split(":").map(Number);
                    const [hoursB, minutesB, secondsB] = b.expectedTime.split(":").map(Number);
                    timeA.setHours(hoursA, minutesA, secondsA);
                    timeB.setHours(hoursB, minutesB, secondsB);
                    return timeA - timeB; // Sort by the nearest future time
                  })[0]; // Get the first stop (nearest in the future)

                if (nearestStop) {
                  setSelectedStop(nearestStop);
                } else {
                  alert("No future stops available.");
                }
              }}
            >
              Select Nearest Future Stop
            </button>
          </div>
        )}
      </div>

      {/* Map */}
      <MapContainer
        center={[50.0647, 19.9450]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <HeatmapLayer data={busData} />
        <MapController selectedStop={selectedStop} />

        {/* Marker for selected stop */}
        {selectedStop && (
          <Marker position={[selectedStop.lat, selectedStop.lng]}>
            <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
              <div>
                <strong>{selectedStop.name}</strong>
                <br />
                <span>Delay: {selectedStop.delay} min</span>
              </div>
            </Tooltip>
          </Marker>
        )}

        {/* Marker for each stop */}
        {stops.map(stop => (
          <Marker
            key={`${stop.name}-${stop.lat}-${stop.lng}`}
            position={[stop.lat, stop.lng]}
            icon={L.divIcon({
              className: "custom-marker",
              html: `
                <div style="
                  background-color: ${getHeatmapColor(stop.delay)};
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  border: 2px solid white;
                "></div>
              `,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
              <div>
                <strong>{stop.name}</strong>
                <br />
                <span>Delay: {stop.delay} min</span>
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
