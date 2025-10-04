import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

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

export default function BusHeatmap() {
  const [busData, setBusData] = useState([]);
  const [selectedLine, setSelectedLine] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedStop, setSelectedStop] = useState(null);

  useEffect(() => {
    // Dummy bus stop data in Kraków
    const dummyData = [
      { line: "105", route: "Dworzec Główny - Bronowice", stop: "Dworzec Główny", lat: 50.0675, lng: 19.9450, avg_delay: 4.2 },
      { line: "139", route: "Myślenice - Kombinat", stop: "Plac Inwalidów", lat: 50.0688, lng: 19.9275, avg_delay: 6.8 },
      { line: "173", route: "Nowa Huta - Kurdwanów", stop: "Rondo Mogilskie", lat: 50.0665, lng: 19.9620, avg_delay: 2.5 },
      { line: "179", route: "Borek Fałęcki - Os. Kurdwanów", stop: "ICE Centrum", lat: 50.0465, lng: 19.9350, avg_delay: 7.0 },
      { line: "304", route: "Dworzec Główny - Wieliczka", stop: "Galeria Krakowska", lat: 50.0670, lng: 19.9480, avg_delay: 5.5 },
      { line: "152", route: "Olszanica - Aleja Przyjaźni", stop: "AGH/UR", lat: 50.0683, lng: 19.9120, avg_delay: 3.0 },
      { line: "105", route: "Dworzec Główny - Bronowice", stop: "Bronowice Małe", lat: 50.0860, lng: 19.8920, avg_delay: 8.1 },
      { line: "139", route: "Myślenice - Kombinat", stop: "Nowy Kleparz", lat: 50.0740, lng: 19.9365, avg_delay: 4.7 },
      { line: "173", route: "Nowa Huta - Kurdwanów", stop: "Kurdwanów P+R", lat: 50.0115, lng: 19.9510, avg_delay: 9.2 },
      { line: "179", route: "Borek Fałęcki - Os. Kurdwanów", stop: "Borek Fałęcki", lat: 50.0205, lng: 19.9330, avg_delay: 3.8 },
      { line: "304", route: "Dworzec Główny - Wieliczka", stop: "Wieliczka Rynek", lat: 49.9870, lng: 20.0650, avg_delay: 6.0 },
      { line: "152", route: "Olszanica - Aleja Przyjaźni", stop: "Olszanica", lat: 50.0820, lng: 19.8430, avg_delay: 1.9 },
      { line: "105", route: "Dworzec Główny - Bronowice", stop: "Teatr Bagatela", lat: 50.0648, lng: 19.9315, avg_delay: 5.3 },
      { line: "139", route: "Myślenice - Kombinat", stop: "Kombinat", lat: 50.0720, lng: 20.0450, avg_delay: 7.6 },
      { line: "173", route: "Nowa Huta - Kurdwanów", stop: "Os. Centrum", lat: 50.0728, lng: 20.0130, avg_delay: 2.1 }
    ];
    setBusData(dummyData);
  }, []);

  // Filter unique values
  const lines = [...new Set(busData.map(b => b.line))];
  const routes = [...new Set(busData.filter(b => b.line === selectedLine).map(b => b.route))];
  const stops = busData.filter(b => b.route === selectedRoute);

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      {/* Control Panel */}
      <div style={{
        position: "absolute",
        top: 10,
        left: 10,
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
              {routes.map(route => <option key={route} value={route}>{route}</option>)}
            </select>
          </div>
        )}

        {selectedRoute && (
          <div>
            <label>Stop: </label>
            <select value={selectedStop?.stop || ""} onChange={e => {
              const stop = stops.find(s => s.stop === e.target.value);
              setSelectedStop(stop);
            }}>
              <option value="">Select stop</option>
              {stops.map(stop => (
                <option key={stop.stop} value={stop.stop}>
                  {stop.stop}
                </option>
              ))}
            </select>
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
                <strong>{selectedStop.stop}</strong><br />
                Line: {selectedStop.line}<br />
                Route: {selectedStop.route}<br />
                Avg Delay: {selectedStop.avg_delay} min
              </div>
            </Tooltip>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
