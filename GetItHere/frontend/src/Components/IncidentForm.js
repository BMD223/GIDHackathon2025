
import React, { useState } from 'react';

const incidentTypes = [
  'Vehicle Crash',
  'Route Change',
  'Service Disruption',
  'Road Closure',
  'Overcrowding',
  'Technical Failure'
];

const severityLevels = ['Low', 'Medium', 'High', 'Critical'];

const vehicleTypes = ['Bus', 'Tram', 'Trolleybus', 'Metro'];

const getCurrentDateTimeLocal = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
};

const IncidentForm = () => {
  const [selectedIncidentType, setSelectedIncidentType] = useState('');
  const [formData, setFormData] = useState({
    vehicleType: '',
    lineNumber: '',
    location: '',
    severity: '',
    incidentTime: getCurrentDateTimeLocal(),
    description: '',
    affectedRoutes: '',
    estimatedDuration: '',
    alternativeRoute: '',
    casualties: '',
    emergencyServices: false,
  });

  const handleIncidentTypeSelect = (type) => {
    setSelectedIncidentType(type);
    // Reset form data when switching incident types
    setFormData({
      vehicleType: '',
      lineNumber: '',
      location: '',
      severity: '',
      incidentTime: getCurrentDateTimeLocal(),
      description: '',
      affectedRoutes: '',
      estimatedDuration: '',
      alternativeRoute: '',
      casualties: '',
      emergencyServices: false,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Incident Report Submitted:', {
      incidentType: selectedIncidentType,
      ...formData
    });
    // Here you would send the data to your backend
    alert('Incident report submitted successfully!');
  };

  const handleBack = () => {
    setSelectedIncidentType('');
  };

  // Common fields for all incident types
  const renderCommonFields = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vehicle Type
        </label>
        <select
          name="vehicleType"
          value={formData.vehicleType}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">Select Vehicle Type</option>
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
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          placeholder="e.g., Main Street & 5th Avenue"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Severity Level
        </label>
        <select
          name="severity"
          value={formData.severity}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">Select Severity</option>
          {severityLevels.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Incident Time
        </label>
        <input
          type="datetime-local"
          name="incidentTime"
          value={formData.incidentTime}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
    </>
  );

  // Vehicle Crash specific fields
  const renderCrashFields = () => (
    <>
      {renderCommonFields()}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of Casualties (if any)
        </label>
        <input
          type="number"
          name="casualties"
          value={formData.casualties}
          onChange={handleChange}
          min="0"
          placeholder="0"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="emergencyServices"
          checked={formData.emergencyServices}
          onChange={handleChange}
          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">
          Emergency Services Called
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Incident Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="4"
          placeholder="Describe the crash incident..."
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
    </>
  );

  // Route Change specific fields
  const renderRouteChangeFields = () => (
    <>
      {renderCommonFields()}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reason for Route Change
        </label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="e.g., Road construction"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alternative Route
        </label>
        <input
          type="text"
          name="alternativeRoute"
          value={formData.alternativeRoute}
          onChange={handleChange}
          required
          placeholder="e.g., Via Park Avenue instead of Main Street"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estimated Duration
        </label>
        <input
          type="text"
          name="estimatedDuration"
          value={formData.estimatedDuration}
          onChange={handleChange}
          required
          placeholder="e.g., 2 hours, 3 days, permanent"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
    </>
  );

  // Service Disruption specific fields
  const renderServiceDisruptionFields = () => (
    <>
      {renderCommonFields()}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type of Disruption
        </label>
        <select
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">Select Type</option>
          <option value="Service Cancelled">Service Cancelled</option>
          <option value="Reduced Frequency">Reduced Frequency</option>
          <option value="Temporary Suspension">Temporary Suspension</option>
          <option value="Strike">Strike</option>
          <option value="Weather Related">Weather Related</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Affected Routes
        </label>
        <input
          type="text"
          name="affectedRoutes"
          value={formData.affectedRoutes}
          onChange={handleChange}
          required
          placeholder="e.g., 42B, 15, 100"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Expected Service Resumption
        </label>
        <input
          type="datetime-local"
          name="estimatedDuration"
          value={formData.estimatedDuration}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
    </>
  );

  // Road Closure specific fields
  const renderRoadClosureFields = () => (
    <>
      {renderCommonFields()}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reason for Closure
        </label>
        <select
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">Select Reason</option>
          <option value="Construction">Construction</option>
          <option value="Accident">Accident</option>
          <option value="Special Event">Special Event</option>
          <option value="Weather Damage">Weather Damage</option>
          <option value="Emergency">Emergency</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Affected Routes
        </label>
        <input
          type="text"
          name="affectedRoutes"
          value={formData.affectedRoutes}
          onChange={handleChange}
          required
          placeholder="List all affected routes"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Expected Reopening
        </label>
        <input
          type="datetime-local"
          name="estimatedDuration"
          value={formData.estimatedDuration}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
    </>
  );

  // Overcrowding specific fields
  const renderOvercrowdingFields = () => (
    <>
      {renderCommonFields()}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Crowding Level
        </label>
        <select
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">Select Level</option>
          <option value="High - Standing room only">High - Standing room only</option>
          <option value="Very High - Difficult to board">Very High - Difficult to board</option>
          <option value="Extreme - Cannot board">Extreme - Cannot board</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Peak Time Period
        </label>
        <input
          type="text"
          name="estimatedDuration"
          value={formData.estimatedDuration}
          onChange={handleChange}
          placeholder="e.g., 8:00 AM - 9:30 AM"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Additional Notes
        </label>
        <textarea
          name="affectedRoutes"
          value={formData.affectedRoutes}
          onChange={handleChange}
          rows="3"
          placeholder="Any additional information..."
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
    </>
  );

  // Technical Failure specific fields
  const renderTechnicalFailureFields = () => (
    <>
      {renderCommonFields()}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type of Failure
        </label>
        <select
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">Select Type</option>
          <option value="Engine Failure">Engine Failure</option>
          <option value="Brake Failure">Brake Failure</option>
          <option value="Electrical Issue">Electrical Issue</option>
          <option value="Door Malfunction">Door Malfunction</option>
          <option value="Communication System">Communication System</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vehicle Status
        </label>
        <select
          name="alternativeRoute"
          value={formData.alternativeRoute}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">Select Status</option>
          <option value="Stopped - Awaiting Repair">Stopped - Awaiting Repair</option>
          <option value="Limping to Depot">Limping to Depot</option>
          <option value="Out of Service">Out of Service</option>
          <option value="Replacement Dispatched">Replacement Dispatched</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estimated Repair Time
        </label>
        <input
          type="text"
          name="estimatedDuration"
          value={formData.estimatedDuration}
          onChange={handleChange}
          placeholder="e.g., 30 minutes, 2 hours"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
    </>
  );

  const renderIncidentSpecificFields = () => {
    switch (selectedIncidentType) {
      case 'Vehicle Crash':
        return renderCrashFields();
      case 'Route Change':
        return renderRouteChangeFields();
      case 'Service Disruption':
        return renderServiceDisruptionFields();
      case 'Road Closure':
        return renderRoadClosureFields();
      case 'Overcrowding':
        return renderOvercrowdingFields();
      case 'Technical Failure':
        return renderTechnicalFailureFields();
      default:
        return null;
    }
  };

  // Render incident type selection
  if (!selectedIncidentType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-10">
          <h2 className="text-3xl font-semibold text-center text-red-700 mb-8">
            Report an Incident
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Select the type of incident you want to report
          </p>
          <div className="grid grid-cols-2 gap-4">
            {incidentTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleIncidentTypeSelect(type)}
                className="p-6 border-2 border-red-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition duration-300 text-xl font-medium text-gray-700 hover:text-red-700"
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-10">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            ← Back
          </button>
          <h2 className="text-3xl font-semibold text-center text-red-700 flex-1">
            {selectedIncidentType} Report
          </h2>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderIncidentSpecificFields()}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-md transition duration-300"
            >
              Submit Incident Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncidentForm;