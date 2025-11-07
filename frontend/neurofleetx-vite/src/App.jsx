import React from 'react';
import './style.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import Login from './components/Login';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import VehicleManagement from './fleet/VehicleManagement';
import TelemetryDashboard from './fleet/TelemetryDashboard';
import RouteOptimization from './fleet/RouteOptimization';
import PredictiveMaintenance from './fleet/PredictiveMaintenance';
import AIDashboard from './fleet/AIDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/vehicles" element={<VehicleManagement />} />
          <Route path="/telemetry" element={<TelemetryDashboard />} />
          <Route path="/routes" element={<RouteOptimization />} />
          <Route path="/maintenance" element={<PredictiveMaintenance />} />
          <Route path="/ai-dashboard" element={<AIDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;