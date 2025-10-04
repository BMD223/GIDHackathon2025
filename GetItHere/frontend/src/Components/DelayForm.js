import React, { useState } from 'react';

const vehicleTypes = ['Bus', 'Tram', 'Trolleybus', 'Metro'];
const getCurrentDateTimeLocal = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
};
const DelayForm = () => {
  const [formData, setFormData] = useState({
    vehicleType: '',
    lineNumber: '',
    stop: '',
    timeOfArrival: getCurrentDateTimeLocal(),
    expectedTimeOfArrival: getCurrentDateTimeLocal(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-10">
        <h2 className="text-3xl font-semibold text-center text-indigo-700 mb-8">
          Vehicle Arrival Form
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Type
            </label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Type</option>
              {vehicleTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Line Number
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
              Stop
            </label>
            <input
              type="text"
              name="stop"
              value={formData.stop}
              onChange={handleChange}
              required
              placeholder="e.g., Pilotów"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
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
            <input
              type="datetime-local"
              name="expectedTimeOfArrival"
              value={formData.expectedTimeOfArrival}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
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
