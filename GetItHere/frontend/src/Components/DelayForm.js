import React, { useState, useEffect } from 'react';

const vehicleTypes = ['Bus', 'Tram', 'Trolleybus', 'Metro'];

const getCurrentDateTimeLocal = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
};

// Helper function to get next closest hour
const getNextClosestHour = () => {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  now.setHours(now.getHours() + 1);
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
};

// Mock data for bus routes - replace this with actual API call
const busRoutesData = {
  '42B': [
    'Central Station → Airport',
    'Airport → Central Station'
  ],
  '15': [
    'North Terminal → South Terminal',
    'South Terminal → North Terminal'
  ],
  '100': [
    'Downtown → University',
    'University → Downtown'
  ],
  // Add more bus lines and their routes as needed
};

// Mock data for bus stops - replace this with actual API call
const busStopsData = {
  '42B': [
    'Central Station',
    'Main Street',
    'Park Avenue',
    'Shopping Mall',
    'University Campus',
    'Hospital',
    'Stadium',
    'Airport Terminal 1',
    'Airport Terminal 2',
    'Pilotów'
  ],
  '15': [
    'North Terminal',
    'City Hall',
    'Library',
    'Museum',
    'South Terminal'
  ],
  '100': [
    'Downtown',
    'Tech Park',
    'Student Housing',
    'University',
    'Sports Complex'
  ],
  // Add more bus lines and their stops as needed
};

// Mock data for scheduled arrival times - replace this with actual API call
// Format: { 'lineNumber': { 'stopName': ['HH:MM', 'HH:MM', ...] } }
const scheduledTimesData = {
  '42B': {
    'Central Station': ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'],
    'Main Street': ['08:05', '08:35', '09:05', '09:35', '10:05', '10:35', '11:05', '11:35', '12:05', '12:35', '13:05', '13:35', '14:05', '14:35', '15:05', '15:35', '16:05', '16:35', '17:05', '17:35', '18:05'],
    'Park Avenue': ['08:10', '08:40', '09:10', '09:40', '10:10', '10:40', '11:10', '11:40', '12:10', '12:40', '13:10', '13:40', '14:10', '14:40', '15:10', '15:40', '16:10', '16:40', '17:10', '17:40', '18:10'],
    'Shopping Mall': ['08:15', '08:45', '09:15', '09:45', '10:15', '10:45', '11:15', '11:45', '12:15', '12:45', '13:15', '13:45', '14:15', '14:45', '15:15', '15:45', '16:15', '16:45', '17:15', '17:45', '18:15'],
    'University Campus': ['08:20', '08:50', '09:20', '09:50', '10:20', '10:50', '11:20', '11:50', '12:20', '12:50', '13:20', '13:50', '14:20', '14:50', '15:20', '15:50', '16:20', '16:50', '17:20', '17:50', '18:20'],
    'Hospital': ['08:25', '08:55', '09:25', '09:55', '10:25', '10:55', '11:25', '11:55', '12:25', '12:55', '13:25', '13:55', '14:25', '14:55', '15:25', '15:55', '16:25', '16:55', '17:25', '17:55', '18:25'],
    'Stadium': ['08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'],
    'Airport Terminal 1': ['08:35', '09:05', '09:35', '10:05', '10:35', '11:05', '11:35', '12:05', '12:35', '13:05', '13:35', '14:05', '14:35', '15:05', '15:35', '16:05', '16:35', '17:05', '17:35', '18:05', '18:35'],
    'Airport Terminal 2': ['08:40', '09:10', '09:40', '10:10', '10:40', '11:10', '11:40', '12:10', '12:40', '13:10', '13:40', '14:10', '14:40', '15:10', '15:40', '16:10', '16:40', '17:10', '17:40', '18:10', '18:40'],
    'Pilotów': ['08:45', '09:15', '09:45', '10:15', '10:45', '11:15', '11:45', '12:15', '12:45', '13:15', '13:45', '14:15', '14:45', '15:15', '15:45', '16:15', '16:45', '17:15', '17:45', '18:15', '18:45']
  },
  '15': {
    'North Terminal': ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'],
    'City Hall': ['07:10', '07:40', '08:10', '08:40', '09:10', '09:40', '10:10', '10:40', '11:10', '11:40', '12:10', '12:40', '13:10', '13:40', '14:10', '14:40', '15:10', '15:40', '16:10', '16:40', '17:10'],
    'Library': ['07:15', '07:45', '08:15', '08:45', '09:15', '09:45', '10:15', '10:45', '11:15', '11:45', '12:15', '12:45', '13:15', '13:45', '14:15', '14:45', '15:15', '15:45', '16:15', '16:45', '17:15'],
    'Museum': ['07:20', '07:50', '08:20', '08:50', '09:20', '09:50', '10:20', '10:50', '11:20', '11:50', '12:20', '12:50', '13:20', '13:50', '14:20', '14:50', '15:20', '15:50', '16:20', '16:50', '17:20'],
    'South Terminal': ['07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']
  },
  '100': {
    'Downtown': ['06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
    'Tech Park': ['06:10', '06:40', '07:10', '07:40', '08:10', '08:40', '09:10', '09:40', '10:10', '10:40', '11:10', '11:40', '12:10', '12:40', '13:10', '13:40', '14:10', '14:40', '15:10', '15:40', '16:10'],
    'Student Housing': ['06:15', '06:45', '07:15', '07:45', '08:15', '08:45', '09:15', '09:45', '10:15', '10:45', '11:15', '11:45', '12:15', '12:45', '13:15', '13:45', '14:15', '14:45', '15:15', '15:45', '16:15'],
    'University': ['06:20', '06:50', '07:20', '07:50', '08:20', '08:50', '09:20', '09:50', '10:20', '10:50', '11:20', '11:50', '12:20', '12:50', '13:20', '13:50', '14:20', '14:50', '15:20', '15:50', '16:20'],
    'Sports Complex': ['06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']
  }
};

const DelayForm = () => {
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [formData, setFormData] = useState({
    lineNumber: '',
    stop: '',
    route: '',
    timeOfArrival: getCurrentDateTimeLocal(),
    expectedTimeOfArrival: getNextClosestHour(),
  });
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [availableStops, setAvailableStops] = useState([]);
  const [filteredStops, setFilteredStops] = useState([]);
  const [showStopDropdown, setShowStopDropdown] = useState(false);
  const [stopSearchInput, setStopSearchInput] = useState('');
  const [scheduledTimes, setScheduledTimes] = useState([]);

  // Update available routes when line number changes
  useEffect(() => {
    if (selectedVehicle === 'Bus' && formData.lineNumber) {
      const routes = busRoutesData[formData.lineNumber] || [];
      setAvailableRoutes(routes);
      // Reset route selection if the line number changes
      if (!routes.includes(formData.route)) {
        setFormData(prev => ({ ...prev, route: '' }));
      }

      // Update available stops for the line
      const stops = busStopsData[formData.lineNumber] || [];
      setAvailableStops(stops);
      setFilteredStops(stops);
      
      // Reset stop if it's not in the new stops list
      if (!stops.includes(formData.stop)) {
        setFormData(prev => ({ ...prev, stop: '' }));
        setStopSearchInput('');
      }
    } else {
      setAvailableRoutes([]);
      setAvailableStops([]);
      setFilteredStops([]);
    }
  }, [formData.lineNumber, selectedVehicle, formData.route, formData.stop]);

  // Update scheduled times when line number and stop change
  useEffect(() => {
    if (selectedVehicle === 'Bus' && formData.lineNumber && formData.stop) {
      const times = scheduledTimesData[formData.lineNumber]?.[formData.stop] || [];
      
      // Convert times to datetime-local format for today
      const today = new Date().toISOString().slice(0, 10);
      const fullTimes = times.map(time => `${today}T${time}`);
      
      setScheduledTimes(fullTimes);
      
      // Set default to next closest hour if current selection is not in the list
      if (!fullTimes.includes(formData.expectedTimeOfArrival)) {
        setFormData(prev => ({ ...prev, expectedTimeOfArrival: getNextClosestHour() }));
      }
    } else {
      setScheduledTimes([]);
    }
  }, [formData.lineNumber, formData.stop, selectedVehicle, formData.expectedTimeOfArrival]);

  // Filter stops based on search input
  useEffect(() => {
    if (stopSearchInput === '') {
      setFilteredStops(availableStops);
    } else {
      const filtered = availableStops.filter(stop =>
        stop.toLowerCase().includes(stopSearchInput.toLowerCase())
      );
      setFilteredStops(filtered);
    }
  }, [stopSearchInput, availableStops]);

  const handleVehicleSelect = (type) => {
    setSelectedVehicle(type);
    // Reset form data when switching vehicle types
    setFormData({
      lineNumber: '',
      stop: '',
      route: '',
      timeOfArrival: getCurrentDateTimeLocal(),
      expectedTimeOfArrival: getNextClosestHour(),
    });
    setStopSearchInput('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStopSearchChange = (e) => {
    const value = e.target.value;
    setStopSearchInput(value);
    setShowStopDropdown(true);
    
    // Only set the stop in formData if it matches exactly
    if (availableStops.includes(value)) {
      setFormData(prev => ({ ...prev, stop: value }));
    } else {
      setFormData(prev => ({ ...prev, stop: '' }));
    }
  };

  const handleStopSelect = (stop) => {
    setStopSearchInput(stop);
    setFormData(prev => ({ ...prev, stop: stop }));
    setShowStopDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate that the stop is in the available stops
    if (selectedVehicle === 'Bus' && !availableStops.includes(formData.stop)) {
      alert('Please select a valid bus stop from the list');
      return;
    }
    
    console.log('Form Submitted:', {
      vehicleType: selectedVehicle,
      ...formData
    });
  };

  const handleBack = () => {
    setSelectedVehicle('');
    setStopSearchInput('');
  };

  // Render vehicle type selection
  if (!selectedVehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-10">
          <h2 className="text-3xl font-semibold text-center text-indigo-700 mb-8">
            Select Vehicle Type
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {vehicleTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleVehicleSelect(type)}
                className="p-6 border-2 border-indigo-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition duration-300 text-xl font-medium text-gray-700 hover:text-indigo-700"
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render form based on selected vehicle type
  const renderBusForm = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bus Line Number
        </label>
        <input
          type="text"
          name="lineNumber"
          value={formData.lineNumber}
          onChange={handleChange}
          required
          placeholder="e.g., 42B"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Route
        </label>
        <select
          name="route"
          value={formData.route}
          onChange={handleChange}
          required
          disabled={!formData.lineNumber || availableRoutes.length === 0}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">
            {!formData.lineNumber 
              ? 'Enter line number first' 
              : availableRoutes.length === 0 
                ? 'No routes found for this line'
                : 'Select Direction'}
          </option>
          {availableRoutes.map((route, index) => (
            <option key={index} value={route}>
              {route}
            </option>
          ))}
        </select>
      </div>
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bus Stop
        </label>
        <input
          type="text"
          value={stopSearchInput}
          onChange={handleStopSearchChange}
          onFocus={() => setShowStopDropdown(true)}
          onBlur={() => setTimeout(() => setShowStopDropdown(false), 200)}
          required
          disabled={!formData.lineNumber || availableStops.length === 0}
          placeholder={!formData.lineNumber ? "Enter line number first" : "Search for a stop..."}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          autoComplete="off"
        />
        {showStopDropdown && filteredStops.length > 0 && formData.lineNumber && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredStops.map((stop, index) => (
              <div
                key={index}
                onClick={() => handleStopSelect(stop)}
                className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-gray-700"
              >
                {stop}
              </div>
            ))}
          </div>
        )}
        {showStopDropdown && filteredStops.length === 0 && stopSearchInput && formData.lineNumber && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            <div className="px-4 py-2 text-gray-500 italic">
              No stops found matching "{stopSearchInput}"
            </div>
          </div>
        )}
      </div>
    </>
  );

  const renderTramForm = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tram Line Number
        </label>
        <input
          type="text"
          name="lineNumber"
          value={formData.lineNumber}
          onChange={handleChange}
          required
          placeholder="e.g., 10"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tram Stop
        </label>
        <input
          type="text"
          name="stop"
          value={formData.stop}
          onChange={handleChange}
          required
          placeholder="e.g., Main Square"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </>
  );

  const renderTrolleybusForm = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Trolleybus Line Number
        </label>
        <input
          type="text"
          name="lineNumber"
          value={formData.lineNumber}
          onChange={handleChange}
          required
          placeholder="e.g., 15T"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Trolleybus Stop
        </label>
        <input
          type="text"
          name="stop"
          value={formData.stop}
          onChange={handleChange}
          required
          placeholder="e.g., Central Station"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </>
  );

  const renderMetroForm = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Metro Line
        </label>
        <input
          type="text"
          name="lineNumber"
          value={formData.lineNumber}
          onChange={handleChange}
          required
          placeholder="e.g., M1"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Metro Station
        </label>
        <input
          type="text"
          name="stop"
          value={formData.stop}
          onChange={handleChange}
          required
          placeholder="e.g., Centrum"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </>
  );

  const renderVehicleSpecificFields = () => {
    switch (selectedVehicle) {
      case 'Bus':
        return renderBusForm();
      case 'Tram':
        return renderTramForm();
      case 'Trolleybus':
        return renderTrolleybusForm();
      case 'Metro':
        return renderMetroForm();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-10">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back
          </button>
          <h2 className="text-3xl font-semibold text-center text-indigo-700 flex-1">
            {selectedVehicle} Arrival Form
          </h2>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderVehicleSpecificFields()}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time of Arrival
            </label>
            <input
              type="datetime-local"
              name="timeOfArrival"
              value={formData.timeOfArrival}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Time of Arrival
            </label>
            {selectedVehicle === 'Bus' && scheduledTimes.length > 0 ? (
              <select
                name="expectedTimeOfArrival"
                value={formData.expectedTimeOfArrival}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={getNextClosestHour()}>
                  Next Hour: {new Date(getNextClosestHour()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </option>
                {scheduledTimes.map((time, index) => (
                  <option key={index} value={time}>
                    {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="datetime-local"
                name="expectedTimeOfArrival"
                value={formData.expectedTimeOfArrival}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-md transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DelayForm;
