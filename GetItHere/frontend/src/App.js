import { useState } from 'react';
import './App.css';
import DelayForm from './Components/DelayForm';
import IncidentForm from './Components/IncidentForm';

function App() {
  const [activeForm, setActiveForm] = useState(null);

  if (!activeForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-10">
          <h1 className="text-4xl font-bold text-center text-purple-700 mb-8">
            Transit Reporting System
          </h1>
          <p className="text-center text-gray-600 mb-8">
            What would you like to report?
          </p>
          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => setActiveForm('delay')}
              className="p-8 border-2 border-indigo-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition duration-300"
            >
              <div className="text-3xl mb-2">🚌</div>
              <div className="text-xl font-medium text-gray-700">Report Delay</div>
            </button>
            <button
              onClick={() => setActiveForm('incident')}
              className="p-8 border-2 border-red-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition duration-300"
            >
              <div className="text-3xl mb-2">⚠️</div>
              <div className="text-xl font-medium text-gray-700">Report Incident</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeForm === 'delay') {
    return <DelayForm />;
  }

  if (activeForm === 'incident') {
    return <IncidentForm />;
  }
}

export default App;
