import React, { useState, useEffect } from 'react';
import { vehicleService } from '../backend/api';

const TelemetryDashboard = () => {
  // State for vehicles data from backend
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch vehicles data from backend
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await vehicleService.getAllVehicles();
        
        // Transform the data to match the expected structure
        const transformedVehicles = response.data.map(vehicle => ({
          ...vehicle,
          lastUpdate: new Date()
        }));
        
        setVehicles(transformedVehicles);
        setError(null);
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError('Failed to fetch vehicles data from the backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Simulate real-time telemetry updates
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prevVehicles => {
        return prevVehicles.map(vehicle => {
          // Only update vehicles that are in use
          if (vehicle.status === 'IN_USE') {
            // Simulate speed changes
            const speedChange = Math.random() * 10 - 5; // -5 to +5 mph
            const newSpeed = Math.max(0, Math.min(80, vehicle.speed + speedChange));
            
            // Simulate battery/fuel consumption
            let newBatteryLevel = vehicle.batteryLevel;
            let newFuelLevel = vehicle.fuelLevel;
            
            if (vehicle.batteryLevel !== null) {
              // Electric vehicle - consume battery based on speed
              const batteryConsumption = (newSpeed * 0.02) + (Math.random() * 0.1);
              newBatteryLevel = Math.max(0, vehicle.batteryLevel - batteryConsumption);
            } else {
              // Fuel vehicle - consume fuel based on speed
              const fuelConsumption = (newSpeed * 0.015) + (Math.random() * 0.05);
              newFuelLevel = Math.max(0, vehicle.fuelLevel - fuelConsumption);
            }
            
            // Simulate location changes (very simplified)
            const latChange = (Math.random() - 0.5) * 0.001;
            const lngChange = (Math.random() - 0.5) * 0.001;
            
            return {
              ...vehicle,
              speed: parseFloat(newSpeed.toFixed(1)),
              batteryLevel: newBatteryLevel !== undefined ? parseFloat(newBatteryLevel.toFixed(1)) : vehicle.batteryLevel,
              fuelLevel: newFuelLevel !== undefined ? parseFloat(newFuelLevel.toFixed(1)) : vehicle.fuelLevel,
              latitude: parseFloat((vehicle.latitude + latChange).toFixed(4)),
              longitude: parseFloat((vehicle.longitude + lngChange).toFixed(4)),
              lastUpdate: new Date()
            };
          }
          return vehicle;
        });
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'AVAILABLE': return 'bg-gradient-to-r from-emerald-500 to-teal-600';
      case 'IN_USE': return 'bg-gradient-to-r from-cyan-500 to-blue-600';
      case 'MAINTENANCE': return 'bg-gradient-to-r from-amber-500 to-orange-600';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'AVAILABLE': return 'Available';
      case 'IN_USE': return 'In Use';
      case 'MAINTENANCE': return 'Needs Service';
      default: return status;
    }
  };

  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 text-gray-800 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading telemetry data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 text-gray-800 p-6 flex items-center justify-center">
        <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 text-gray-800 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 mb-2">
          Vehicle Telemetry Dashboard
        </h1>
        <p className="text-lg text-gray-700">
          Real-time monitoring of vehicle status, location, and performance metrics
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-cyan-600 mb-2">{vehicles.length}</div>
          <div className="text-gray-700">Total Vehicles</div>
        </div>
        <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-emerald-600 mb-2">
            {vehicles.filter(v => v.status === 'AVAILABLE').length}
          </div>
          <div className="text-gray-700">Available</div>
        </div>
        <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {vehicles.filter(v => v.status === 'IN_USE').length}
          </div>
          <div className="text-gray-700">In Use</div>
        </div>
        <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-amber-600 mb-2">
            {vehicles.filter(v => v.status === 'MAINTENANCE').length}
          </div>
          <div className="text-gray-700">Needs Service</div>
        </div>
      </div>

      {/* Vehicle Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-gradient-to-br from-white to-cyan-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-cyan-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">
                  {vehicle.manufacturer} {vehicle.model}
                </h3>
                <p className="text-gray-700 text-lg">{vehicle.vehicleNumber}</p>
                <p className="text-gray-600 text-md mt-1">{vehicle.type}</p>
              </div>
              <div className="text-right">
                <span className={`px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg ${getStatusColor(vehicle.status)} transform hover:scale-105 transition-transform duration-300`}>
                  {getStatusText(vehicle.status)}
                </span>
                <div className="mt-2 text-sm text-gray-500">
                  Updated: {formatTime(vehicle.lastUpdate)}
                </div>
              </div>
            </div>

            {/* Speed */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 text-lg">Speed</span>
                <span className="font-bold text-2xl text-gray-800">{vehicle.speed} mph</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 h-4 rounded-full" 
                  style={{ width: `${Math.min(100, vehicle.speed)}%` }}
                ></div>
              </div>
            </div>

            {/* Battery/Fuel Level */}
            <div className="mb-6">
              {vehicle.batteryLevel !== null ? (
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 text-lg">Battery</span>
                    <span className="font-bold text-gray-800 text-lg">{vehicle.batteryLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className={`h-4 rounded-full ${
                        vehicle.batteryLevel > 50 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
                          : vehicle.batteryLevel > 20 
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600' 
                            : 'bg-gradient-to-r from-red-500 to-orange-600'
                      }`} 
                      style={{ width: `${vehicle.batteryLevel}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 text-lg">Fuel</span>
                    <span className="font-bold text-gray-800 text-lg">{vehicle.fuelLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className={`h-4 rounded-full ${
                        vehicle.fuelLevel > 50 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
                          : vehicle.fuelLevel > 20 
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600' 
                            : 'bg-gradient-to-r from-red-500 to-orange-600'
                      }`} 
                      style={{ width: `${vehicle.fuelLevel}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Health Score */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 text-lg">Health Score</span>
                <span className="font-bold text-gray-800 text-lg">{vehicle.healthScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 h-4 rounded-full" 
                  style={{ width: `${vehicle.healthScore}%` }}
                ></div>
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 text-lg">Location</span>
                <span className="font-bold text-gray-800 text-lg">
                  {vehicle.latitude.toFixed(4)}, {vehicle.longitude.toFixed(4)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-xl h-32 flex items-center justify-center">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gray-600">Map View</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TelemetryDashboard;