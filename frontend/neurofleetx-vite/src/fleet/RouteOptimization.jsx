import React, { useState, useEffect } from 'react';
import { vehicleService } from '../backend/api';

const RouteOptimization = () => {
  // State for vehicles data from backend
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for routes data
  const [routes, setRoutes] = useState([]);
  
  // State for map data
  const [mapData, setMapData] = useState({
    center: { lat: 40.7128, lng: -74.0060 },
    zoom: 12,
    routes: [],
    trafficZones: [
      { id: 1, name: 'Downtown Core', level: 'heavy', coordinates: { lat: 40.75, lng: -73.98 } },
      { id: 2, name: 'Midtown', level: 'medium', coordinates: { lat: 40.76, lng: -73.97 } },
      { id: 3, name: 'Financial District', level: 'low', coordinates: { lat: 40.71, lng: -74.01 } }
    ]
  });

  // Fetch vehicles data from backend
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await vehicleService.getAllVehicles();
        
        // Transform the data to match the expected structure
        const transformedVehicles = response.data.map(vehicle => ({
          id: vehicle.id,
          vehicleNumber: vehicle.vehicleNumber,
          model: vehicle.model,
          manufacturer: vehicle.manufacturer,
          type: vehicle.type,
          status: vehicle.status,
          batteryLevel: vehicle.batteryLevel,
          fuelLevel: vehicle.fuelLevel,
          latitude: vehicle.latitude,
          longitude: vehicle.longitude
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

  // Mock route data with more detailed information
  useEffect(() => {
    // Mock routes data
    const mockRoutes = [
      {
        id: 1,
        name: 'Downtown Delivery Route',
        vehicle: 'NF-001',
        startTime: '09:00 AM',
        endTime: '11:30 AM',
        distance: '12.5 miles',
        eta: '25 min',
        stops: 5,
        status: 'ACTIVE',
        startLocation: 'Manhattan, NY',
        endLocation: 'Midtown, NY',
        alternateRoutes: [
          { id: 1, name: 'Via FDR Drive', eta: '30 min', distance: '15.2 miles', traffic: 'low' },
          { id: 2, name: 'Via West Side Hwy', eta: '35 min', distance: '16.8 miles', traffic: 'medium' }
        ]
      },
      {
        id: 2,
        name: 'Airport Shuttle',
        vehicle: 'NF-002',
        startTime: '10:15 AM',
        endTime: '01:45 PM',
        distance: '28.3 miles',
        eta: '42 min',
        stops: 8,
        status: 'PLANNED',
        startLocation: 'Downtown, NY',
        endLocation: 'JFK Airport',
        alternateRoutes: [
          { id: 1, name: 'Via Queens Blvd', eta: '50 min', distance: '32.1 miles', traffic: 'heavy' },
          { id: 2, name: 'Via Belt Pkwy', eta: '45 min', distance: '30.5 miles', traffic: 'medium' }
        ]
      }
    ];
    
    setRoutes(mockRoutes);
    
    // Update map data with routes
    setMapData(prev => ({
      ...prev,
      routes: [
        {
          id: 1,
          path: [
            { lat: 40.7128, lng: -74.0060 },
            { lat: 40.7215, lng: -73.9992 },
            { lat: 40.7345, lng: -73.9882 },
            { lat: 40.7452, lng: -73.9776 }
          ],
          color: '#3B82F6',
          traffic: 'low'
        },
        {
          id: 2,
          path: [
            { lat: 40.7580, lng: -73.9855 },
            { lat: 40.7614, lng: -73.9776 },
            { lat: 40.7678, lng: -73.9680 },
            { lat: 40.7742, lng: -73.9584 }
          ],
          color: '#10B981',
          traffic: 'medium'
        }
      ]
    }));
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'ACTIVE': return 'bg-gradient-to-r from-cyan-500 to-blue-600';
      case 'PLANNED': return 'bg-gradient-to-r from-emerald-500 to-teal-600';
      case 'COMPLETED': return 'bg-gradient-to-r from-gray-500 to-gray-700';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-600';
    }
  };

  const getTrafficColor = (traffic) => {
    switch(traffic) {
      case 'low': return 'bg-emerald-500';
      case 'medium': return 'bg-amber-500';
      case 'heavy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Form state for route planning
  const [routeForm, setRouteForm] = useState({
    startLocation: '',
    endLocation: '',
    vehicleId: '',
    optimizationCriteria: 'time'
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setRouteForm({
      ...routeForm,
      [name]: value
    });
  };

  const handlePlanRoute = (e) => {
    e.preventDefault();
    // In a real app, this would call an API to calculate the optimal route
    alert('Route planning simulation - In a real application, this would calculate the optimal route using AI algorithms (Dijkstra + ML-based ETA predictor)');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 text-gray-800 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading fleet data...</p>
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
          AI Route & Load Optimization
        </h1>
        <p className="text-lg text-gray-700">
          Intelligent route planning with dynamic traffic and energy optimization
        </p>
      </div>

      {/* Route Planning Form */}
      <div className="bg-gradient-to-br from-white to-cyan-50 rounded-3xl p-8 shadow-xl mb-8">
        <h2 className="text-2xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 mb-6">
          Plan New Route
        </h2>
        <form onSubmit={handlePlanRoute}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-lg font-bold mb-2">Start Location</label>
              <input
                type="text"
                name="startLocation"
                value={routeForm.startLocation}
                onChange={handleFormChange}
                placeholder="Enter start address"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-lg font-bold mb-2">End Location</label>
              <input
                type="text"
                name="endLocation"
                value={routeForm.endLocation}
                onChange={handleFormChange}
                placeholder="Enter destination"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-lg font-bold mb-2">Vehicle</label>
              <select
                name="vehicleId"
                value={routeForm.vehicleId}
                onChange={handleFormChange}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              >
                <option value="">Select a vehicle</option>
                {vehicles.filter(v => v.status === 'AVAILABLE').map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.vehicleNumber} - {vehicle.manufacturer} {vehicle.model}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-lg font-bold mb-2">Optimization Criteria</label>
              <select
                name="optimizationCriteria"
                value={routeForm.optimizationCriteria}
                onChange={handleFormChange}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="time">Shortest Time</option>
                <option value="distance">Shortest Distance</option>
                <option value="energy">Lowest Energy Consumption</option>
                <option value="traffic">Least Traffic</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 font-bold text-lg shadow-lg"
            >
              Calculate Optimal Route
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-white to-cyan-50 rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 mb-6">
              Route Visualization
            </h2>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl h-96 relative overflow-hidden border-2 border-cyan-200">
              {/* Map Background Grid */}
              <div className="absolute inset-0 opacity-20">
                {/* Horizontal grid lines */}
                <div className="absolute top-1/5 left-0 right-0 h-px bg-gray-400"></div>
                <div className="absolute top-2/5 left-0 right-0 h-px bg-gray-400"></div>
                <div className="absolute top-3/5 left-0 right-0 h-px bg-gray-400"></div>
                <div className="absolute top-4/5 left-0 right-0 h-px bg-gray-400"></div>
                
                {/* Vertical grid lines */}
                <div className="absolute left-1/5 top-0 bottom-0 w-px bg-gray-400"></div>
                <div className="absolute left-2/5 top-0 bottom-0 w-px bg-gray-400"></div>
                <div className="absolute left-3/5 top-0 bottom-0 w-px bg-gray-400"></div>
                <div className="absolute left-4/5 top-0 bottom-0 w-px bg-gray-400"></div>
              </div>
              
              {/* Roads */}
              <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-700 rounded-sm"></div>
              <div className="absolute top-1/3 left-1/4 w-2 h-2/3 bg-gray-700 rounded-sm"></div>
              <div className="absolute top-1/2 left-1/2 w-2 h-1/2 bg-gray-700 rounded-sm"></div>
              <div className="absolute top-1/4 left-3/4 w-2 h-1/2 bg-gray-700 rounded-sm"></div>
              
              {/* Traffic Zones */}
              <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-red-200 rounded-lg opacity-70 border-2 border-red-400">
                <div className="text-xs text-red-800 font-bold p-1">Heavy Traffic</div>
              </div>
              <div className="absolute top-3/4 left-1/3 w-1/5 h-1/5 bg-amber-200 rounded-lg opacity-70 border-2 border-amber-400">
                <div className="text-xs text-amber-800 font-bold p-1">Medium Traffic</div>
              </div>
              
              {/* Route 1 - Blue Path */}
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1 bg-blue-500 rounded-full transform rotate-6"></div>
              <div className="absolute top-1/3 left-3/4 w-1/6 h-1 bg-blue-500 rounded-full transform -rotate-12"></div>
              
              {/* Route 2 - Green Path */}
              <div className="absolute top-2/3 left-1/4 w-1/3 h-1 bg-green-500 rounded-full transform rotate-45"></div>
              <div className="absolute top-3/4 left-7/12 w-1/6 h-1 bg-green-500 rounded-full transform -rotate-12"></div>
              
              {/* Start/End markers */}
              <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <div className="text-xs font-bold text-gray-800 mt-1 text-center">Start 1</div>
              </div>
              
              <div className="absolute top-1/3 left-5/6 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">B</span>
                </div>
                <div className="text-xs font-bold text-gray-800 mt-1 text-center">End 1</div>
              </div>
              
              <div className="absolute top-2/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">C</span>
                </div>
                <div className="text-xs font-bold text-gray-800 mt-1 text-center">Start 2</div>
              </div>
              
              <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">D</span>
                </div>
                <div className="text-xs font-bold text-gray-800 mt-1 text-center">End 2</div>
              </div>
              
              {/* Vehicle markers */}
              <div className="absolute top-1/3 left-2/5 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
                <div className="w-8 h-8 bg-cyan-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <div className="absolute top-3/4 left-2/5 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
                <div className="w-8 h-8 bg-cyan-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6">
              {mapData.routes.map((route, index) => (
                <div key={route.id} className="flex items-center">
                  <div 
                    className="w-6 h-2 rounded-full mr-2" 
                    style={{ backgroundColor: route.color }}
                  ></div>
                  <span className="text-gray-700">Route {index + 1}</span>
                </div>
              ))}
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2 border border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <span className="text-gray-700">Start</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-2 border border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">B</span>
                </div>
                <span className="text-gray-700">End</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-cyan-600 rounded-full mr-2 border border-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Vehicle</span>
              </div>
            </div>
            
            {/* Traffic Zones */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Traffic Zones</h3>
              <div className="flex flex-wrap gap-3">
                {mapData.trafficZones.map(zone => (
                  <div key={zone.id} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${getTrafficColor(zone.level)}`}></div>
                    <span className="text-sm">{zone.name} ({zone.level})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Route Details */}
        <div>
          <div className="bg-gradient-to-br from-white to-cyan-50 rounded-3xl p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 mb-6">
              Active Routes
            </h2>
            <div className="space-y-6">
              {routes.map((route) => (
                <div key={route.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{route.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(route.status)}`}>
                      {route.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600 text-sm">Vehicle</p>
                      <p className="font-bold">{route.vehicle}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Stops</p>
                      <p className="font-bold">{route.stops}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Distance</p>
                      <p className="font-bold">{route.distance}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">ETA</p>
                      <p className="font-bold">{route.eta}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm">Route</p>
                    <p className="font-bold">{route.startLocation} → {route.endLocation}</p>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-gray-600">Start</p>
                      <p className="font-bold">{route.startTime}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">End</p>
                      <p className="font-bold">{route.endTime}</p>
                    </div>
                  </div>
                  
                  {/* Alternate Routes */}
                  {route.alternateRoutes && route.alternateRoutes.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-bold text-gray-800 mb-2">Alternate Routes</h4>
                      <div className="space-y-2">
                        {route.alternateRoutes.map(alternate => (
                          <div key={alternate.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                            <div>
                              <p className="font-medium">{alternate.name}</p>
                              <p className="text-gray-600">{alternate.distance}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{alternate.eta}</p>
                              <div className="flex items-center justify-end">
                                <span className={`w-2 h-2 rounded-full mr-1 ${getTrafficColor(alternate.traffic)}`}></span>
                                <span className="text-gray-600 capitalize">{alternate.traffic}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Available Vehicles */}
          <div className="bg-gradient-to-br from-white to-cyan-50 rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 mb-6">
              Available Vehicles
            </h2>
            <div className="space-y-4">
              {vehicles.filter(v => v.status === 'AVAILABLE').map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-bold">{vehicle.vehicleNumber}</p>
                    <p className="text-gray-600 text-sm">{vehicle.manufacturer} {vehicle.model}</p>
                  </div>
                  <div className="text-right">
                    {vehicle.batteryLevel !== undefined ? (
                      <p className="text-sm">Battery: {vehicle.batteryLevel}%</p>
                    ) : (
                      <p className="text-sm">Fuel: {vehicle.fuelLevel}%</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Location: {vehicle.latitude.toFixed(2)}, {vehicle.longitude.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteOptimization;