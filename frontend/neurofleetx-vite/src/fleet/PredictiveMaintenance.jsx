import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { vehicleService, aiModelService } from '../backend/api';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const PredictiveMaintenance = () => {
  // State for vehicles data from backend
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for AI predictions
  const [predictions, setPredictions] = useState({});
  const [predictionsLoading, setPredictionsLoading] = useState(false);
  
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
          healthScore: vehicle.healthScore || 80, // Default health score if not provided
          batteryHealth: vehicle.batteryLevel || null,
          tireCondition: Math.min(100, Math.max(0, (vehicle.healthScore || 80) + Math.floor(Math.random() * 20) - 10)), // Simulate tire condition
          engineHealth: vehicle.fuelLevel ? Math.min(100, Math.max(0, (vehicle.healthScore || 80) + Math.floor(Math.random() * 15) - 5)) : null, // Only for fuel vehicles
          fuelSystem: vehicle.fuelLevel || null,
          mileage: vehicle.mileage || Math.floor(Math.random() * 50000),
          nextMaintenance: new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random date within 30 days
          alerts: []
        }));
        
        setVehicles(transformedVehicles);
        setError(null);
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError('Failed to fetch vehicles data from the backend.');
        // Fallback to mock data if backend is not available
        const mockVehicles = [
          {
            id: 1,
            vehicleNumber: 'NF-001',
            model: 'Model S',
            manufacturer: 'Tesla',
            type: 'SEDAN',
            status: 'AVAILABLE',
            healthScore: 95,
            batteryHealth: 92,
            tireCondition: 88,
            engineHealth: null,
            mileage: 12500,
            nextMaintenance: '2025-11-15',
            alerts: []
          },
          {
            id: 2,
            vehicleNumber: 'NF-002',
            model: 'Camry',
            manufacturer: 'Toyota',
            type: 'SEDAN',
            status: 'AVAILABLE',
            healthScore: 88,
            batteryHealth: null,
            tireCondition: 82,
            engineHealth: 90,
            fuelSystem: 85,
            mileage: 28750,
            nextMaintenance: '2025-10-25',
            alerts: []
          },
          {
            id: 3,
            vehicleNumber: 'NF-003',
            model: 'Explorer',
            manufacturer: 'Ford',
            type: 'SUV',
            status: 'IN_USE',
            healthScore: 82,
            batteryHealth: null,
            tireCondition: 75,
            engineHealth: 85,
            fuelSystem: 80,
            mileage: 42300,
            nextMaintenance: '2025-10-20',
            alerts: [
              { id: 1, type: 'warning', message: 'Tire condition degrading', priority: 'medium', action: 'Inspect and rotate tires' }
            ]
          },
          {
            id: 4,
            vehicleNumber: 'NF-004',
            model: 'Transit',
            manufacturer: 'Ford',
            type: 'VAN',
            status: 'MAINTENANCE',
            healthScore: 92,
            batteryHealth: null,
            tireCondition: 90,
            engineHealth: 88,
            fuelSystem: 95,
            mileage: 18500,
            nextMaintenance: '2025-11-05',
            alerts: []
          },
          {
            id: 5,
            vehicleNumber: 'NF-005',
            model: 'Leaf',
            manufacturer: 'Nissan',
            type: 'SEDAN',
            status: 'AVAILABLE',
            healthScore: 65,
            batteryHealth: 60,
            tireCondition: 70,
            engineHealth: null,
            mileage: 35200,
            nextMaintenance: '2025-10-18',
            alerts: [
              { id: 2, type: 'critical', message: 'Battery health critically low', priority: 'high', action: 'Replace battery pack' },
              { id: 3, type: 'warning', message: 'Scheduled maintenance due soon', priority: 'medium', action: 'Schedule service appointment' }
            ]
          }
        ];
        setVehicles(mockVehicles);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Fetch AI predictions for all vehicles
  const fetchAIPredictions = async () => {
    try {
      setPredictionsLoading(true);
      const response = await aiModelService.predictAllVehicles();
      setPredictions(response.data.predictions || {});
    } catch (err) {
      console.error('Error fetching AI predictions:', err);
    } finally {
      setPredictionsLoading(false);
    }
  };

  // Mock historical data for charts
  const [historicalData] = useState({
    healthTrend: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      datasets: [
        {
          label: 'Fleet Health Score',
          data: [85, 87, 89, 86, 88, 90, 92, 89, 91, 88],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    maintenanceDistribution: {
      labels: ['Healthy', 'Due Soon', 'Critical'],
      datasets: [
        {
          label: 'Maintenance Status',
          data: [3, 1, 1],
          backgroundColor: [
            '#10B981',  // Green for Healthy
            '#F59E0B',  // Amber for Due Soon
            '#EF4444'   // Red for Critical
          ]
        }
      ]
    },
    componentHealth: {
      labels: ['NF-001', 'NF-002', 'NF-003', 'NF-004', 'NF-005'],
      datasets: [
        {
          label: 'Engine Health',
          data: [0, 90, 85, 88, 0],
          backgroundColor: '#3B82F6'
        },
        {
          label: 'Tire Condition',
          data: [88, 82, 75, 90, 70],
          backgroundColor: '#10B981'
        },
        {
          label: 'Battery Health',
          data: [92, 0, 0, 0, 60],
          backgroundColor: '#F59E0B'
        }
      ]
    }
  });

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Fleet Health Trend (Wear over time)'
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Maintenance Status Distribution'
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Component Health by Vehicle'
      }
    }
  };

  // Filter vehicles by alert status
  const vehiclesWithAlerts = vehicles.filter(vehicle => vehicle.alerts.length > 0);
  const vehiclesNeedingSoon = vehicles.filter(vehicle => {
    const nextMaintenanceDate = new Date(vehicle.nextMaintenance);
    const today = new Date();
    const timeDiff = nextMaintenanceDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 7 && daysDiff >= 0;
  });

  // Get maintenance status for a vehicle
  const getMaintenanceStatus = (vehicle) => {
    const nextMaintenanceDate = new Date(vehicle.nextMaintenance);
    const today = new Date();
    const timeDiff = nextMaintenanceDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff <= 3) return 'Critical';
    if (daysDiff <= 7) return 'Due Soon';
    return 'Healthy';
  };

  // Get maintenance status color
  const getMaintenanceStatusColor = (status) => {
    switch(status) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'Due Soon': return 'bg-amber-100 text-amber-800';
      case 'Healthy': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get AI prediction for a specific vehicle
  const getVehiclePrediction = (vehicleId) => {
    return predictions[vehicleId] || null;
  };

  // Get maintenance recommendation based on AI prediction
  const getMaintenanceRecommendation = (vehicleId) => {
    const prediction = getVehiclePrediction(vehicleId);
    if (!prediction) return "No prediction available";
    
    if (prediction.needsMaintenance) {
      return `${prediction.maintenanceType} recommended in ${prediction.predictedDays} days`;
    }
    return "No immediate maintenance needed";
  };

  // Get component health from AI prediction
  const getComponentHealth = (vehicleId, component) => {
    const prediction = getVehiclePrediction(vehicleId);
    if (!prediction || !prediction.components) return "Unknown";
    return prediction.components[component] || "Unknown";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 text-gray-800 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 mb-2">
          Predictive Maintenance & Health Analytics
        </h1>
        <p className="text-lg text-gray-700">
          AI-powered vehicle health monitoring and maintenance prediction
        </p>
        {/* AI Model Refresh Button */}
        <div className="mt-4">
          <button 
            onClick={fetchAIPredictions}
            disabled={predictionsLoading}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition hover:scale-105 duration-300 ease-in-out disabled:opacity-50"
          >
            {predictionsLoading ? 'Analyzing with AI...' : 'Refresh AI Predictions'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-cyan-600 mb-2">{vehicles.length}</div>
          <div className="text-gray-700">Total Vehicles</div>
        </div>
        <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-amber-600 mb-2">{vehiclesWithAlerts.length}</div>
          <div className="text-gray-700">Vehicles with Alerts</div>
        </div>
        <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-red-600 mb-2">{vehiclesNeedingSoon.length}</div>
          <div className="text-gray-700">Maintenance Due Soon</div>
        </div>
        <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-emerald-600 mb-2">
            {Math.round(vehicles.reduce((sum, v) => sum + v.healthScore, 0) / vehicles.length)}%
          </div>
          <div className="text-gray-700">Avg. Health Score</div>
        </div>
        <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {Object.keys(predictions).filter(id => predictions[id]?.needsMaintenance).length}
          </div>
          <div className="text-gray-700">AI Predicted Issues</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gradient-to-br from-white to-cyan-50 rounded-3xl p-8 shadow-xl h-96">
          <Line data={historicalData.healthTrend} options={lineChartOptions} />
        </div>
        <div className="bg-gradient-to-br from-white to-cyan-50 rounded-3xl p-8 shadow-xl h-96">
          <Pie data={historicalData.maintenanceDistribution} options={pieChartOptions} />
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-cyan-50 rounded-3xl p-8 shadow-xl mb-8 h-96">
        <Bar data={historicalData.componentHealth} options={barChartOptions} />
      </div>

      {/* Alerts and Maintenance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Critical Alerts Table */}
        <div className="bg-gradient-to-br from-white to-cyan-50 rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 mb-6">
            Critical Alerts
          </h2>
          {vehiclesWithAlerts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl">
                <thead>
                  <tr className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                    <th className="py-3 px-4 text-left">Vehicle ID</th>
                    <th className="py-3 px-4 text-left">Issue</th>
                    <th className="py-3 px-4 text-left">Action Needed</th>
                    <th className="py-3 px-4 text-left">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {vehiclesWithAlerts.map(vehicle => (
                    vehicle.alerts.map(alert => (
                      <tr key={alert.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-4 px-4 font-bold">{vehicle.vehicleNumber}</td>
                        <td className="py-4 px-4">{alert.message}</td>
                        <td className="py-4 px-4">{alert.action}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            alert.type === 'critical' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {alert.type.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600">No critical alerts at this time</p>
            </div>
          )}
        </div>

        {/* AI Predictions */}
        <div className="bg-gradient-to-br from-white to-cyan-50 rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 mb-6">
            AI Predictions
          </h2>
          {predictionsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
              <p className="text-gray-600">AI model analyzing vehicle data...</p>
            </div>
          ) : Object.keys(predictions).length > 0 ? (
            <div className="space-y-4">
              {vehicles.slice(0, 3).map(vehicle => {
                const prediction = getVehiclePrediction(vehicle.id);
                return prediction && prediction.needsMaintenance ? (
                  <div key={vehicle.id} className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">{vehicle.vehicleNumber}</h3>
                        <p className="text-gray-700">{prediction.maintenanceType}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 rounded-full text-sm font-bold bg-amber-100 text-amber-800">
                          {prediction.predictedDays} days
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Recommended Actions:</p>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        {prediction.recommendedActions && prediction.recommendedActions.slice(0, 2).map((action, index) => (
                          <li key={index}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null;
              }).filter(Boolean)}
              {Object.keys(predictions).filter(id => predictions[id]?.needsMaintenance).length === 0 && (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-600">No maintenance issues predicted by AI</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <button 
                onClick={fetchAIPredictions}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition hover:scale-105 duration-300"
              >
                Run AI Analysis
              </button>
              <p className="text-gray-600 mt-4">Click to analyze vehicle data with AI model</p>
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Health Details */}
      <div className="bg-gradient-to-br from-white to-cyan-50 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 mb-6">
          Vehicle Health Details
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl">
            <thead>
              <tr className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                <th className="py-3 px-4 text-left">Vehicle</th>
                <th className="py-3 px-4 text-left">Health Score</th>
                <th className="py-3 px-4 text-left">AI Prediction</th>
                <th className="py-3 px-4 text-left">Engine</th>
                <th className="py-3 px-4 text-left">Tires</th>
                <th className="py-3 px-4 text-left">Battery</th>
                <th className="py-3 px-4 text-left">Fuel System</th>
                <th className="py-3 px-4 text-left">Mileage</th>
                <th className="py-3 px-4 text-left">Next Maintenance</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(vehicle => (
                <tr key={vehicle.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-bold">{vehicle.vehicleNumber}</div>
                      <div className="text-gray-600 text-sm">{vehicle.manufacturer} {vehicle.model}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            vehicle.healthScore > 80 
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
                              : vehicle.healthScore > 60 
                                ? 'bg-gradient-to-r from-amber-500 to-orange-600' 
                                : 'bg-gradient-to-r from-red-500 to-orange-600'
                          }`} 
                          style={{ width: `${vehicle.healthScore}%` }}
                        ></div>
                      </div>
                      <span className="font-bold">{vehicle.healthScore}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {predictions[vehicle.id] ? (
                      <div>
                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                          predictions[vehicle.id].needsMaintenance 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {predictions[vehicle.id].needsMaintenance ? 'Attention' : 'Good'}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {predictions[vehicle.id].predictedDays} days
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">No data</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {vehicle.engineHealth ? (
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              vehicle.engineHealth > 80 
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
                                : vehicle.engineHealth > 60 
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-600' 
                                  : 'bg-gradient-to-r from-red-500 to-orange-600'
                            }`} 
                            style={{ width: `${vehicle.engineHealth}%` }}
                          ></div>
                        </div>
                        <span>{vehicle.engineHealth}%</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            vehicle.tireCondition > 80 
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
                              : vehicle.tireCondition > 60 
                                ? 'bg-gradient-to-r from-amber-500 to-orange-600' 
                                : 'bg-gradient-to-r from-red-500 to-orange-600'
                          }`} 
                          style={{ width: `${vehicle.tireCondition}%` }}
                        ></div>
                      </div>
                      <span>{vehicle.tireCondition}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {vehicle.batteryHealth ? (
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              vehicle.batteryHealth > 80 
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
                                : vehicle.batteryHealth > 60 
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-600' 
                                  : 'bg-gradient-to-r from-red-500 to-orange-600'
                            }`} 
                            style={{ width: `${vehicle.batteryHealth}%` }}
                          ></div>
                        </div>
                        <span>{vehicle.batteryHealth}%</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {vehicle.fuelSystem ? (
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              vehicle.fuelSystem > 80 
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
                                : vehicle.fuelSystem > 60 
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-600' 
                                  : 'bg-gradient-to-r from-red-500 to-orange-600'
                            }`} 
                            style={{ width: `${vehicle.fuelSystem}%` }}
                          ></div>
                        </div>
                        <span>{vehicle.fuelSystem}%</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold">{vehicle.mileage.toLocaleString()} miles</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {vehicle.nextMaintenance}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getMaintenanceStatusColor(getMaintenanceStatus(vehicle))}`}>
                      {getMaintenanceStatus(vehicle)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PredictiveMaintenance;