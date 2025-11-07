import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
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

const AIDashboard = () => {
  // State for vehicles data from backend
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for AI predictions
  const [predictions, setPredictions] = useState({});
  const [predictionsLoading, setPredictionsLoading] = useState(false);
  const [modelTrained, setModelTrained] = useState(false);
  
  // Fetch vehicles data from backend
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await vehicleService.getAllVehicles();
        setVehicles(response.data);
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

  // Fetch AI predictions for all vehicles
  const fetchAIPredictions = async () => {
    try {
      setPredictionsLoading(true);
      const response = await aiModelService.predictAllVehicles();
      setPredictions(response.data.predictions || {});
    } catch (err) {
      console.error('Error fetching AI predictions:', err);
      setError('Failed to fetch AI predictions.');
    } finally {
      setPredictionsLoading(false);
    }
  };
  
  // Train the AI model
  const trainAIModel = async () => {
    try {
      setPredictionsLoading(true);
      const response = await aiModelService.trainModel();
      setModelTrained(true);
      // Refresh predictions after training
      fetchAIPredictions();
    } catch (err) {
      console.error('Error training AI model:', err);
      setError('Failed to train AI model.');
    } finally {
      setPredictionsLoading(false);
    }
  };

  // Process data for charts
  const getChartData = () => {
    // Maintenance status distribution
    const maintenanceStatus = {
      labels: ['No Maintenance Needed', 'Maintenance Required'],
      datasets: [
        {
          label: 'Vehicles',
          data: [
            Object.values(predictions).filter(p => !p.needsMaintenance).length,
            Object.values(predictions).filter(p => p.needsMaintenance).length
          ],
          backgroundColor: [
            '#10B981',  // Green for No Maintenance
            '#EF4444'   // Red for Maintenance Required
          ]
        }
      ]
    };
    
    // Component health distribution
    const componentHealth = {
      labels: ['Engine', 'Battery', 'Tires', 'Brakes'],
      datasets: [
        {
          label: 'Good Condition',
          data: [
            Object.values(predictions).filter(p => p.components?.engine === 'Good' || p.components?.engine === 'N/A - Electric Vehicle').length,
            Object.values(predictions).filter(p => p.components?.battery === 'Good' || p.components?.battery === 'N/A - Fuel Vehicle').length,
            Object.values(predictions).filter(p => p.components?.tires === 'Good').length,
            Object.values(predictions).filter(p => p.components?.brakes === 'Good').length
          ],
          backgroundColor: '#10B981'
        },
        {
          label: 'Needs Attention',
          data: [
            Object.values(predictions).filter(p => p.components?.engine === 'Attention Needed').length,
            Object.values(predictions).filter(p => p.components?.battery === 'Monitor').length,
            Object.values(predictions).filter(p => p.components?.tires === 'Check Wear').length,
            Object.values(predictions).filter(p => p.components?.brakes === 'Inspect').length
          ],
          backgroundColor: '#F59E0B'
        },
        {
          label: 'Critical',
          data: [
            Object.values(predictions).filter(p => p.components?.engine === 'Immediate Service').length,
            Object.values(predictions).filter(p => p.components?.battery === 'Replace Soon').length,
            Object.values(predictions).filter(p => p.components?.tires === 'Replace Soon').length,
            Object.values(predictions).filter(p => p.components?.brakes === 'Service Required').length
          ],
          backgroundColor: '#EF4444'
        }
      ]
    };
    
    // Maintenance type distribution
    const maintenanceTypes = {};
    Object.values(predictions).forEach(prediction => {
      if (prediction.maintenanceType) {
        maintenanceTypes[prediction.maintenanceType] = (maintenanceTypes[prediction.maintenanceType] || 0) + 1;
      }
    });
    
    const maintenanceTypeData = {
      labels: Object.keys(maintenanceTypes),
      datasets: [
        {
          label: 'Maintenance Types',
          data: Object.values(maintenanceTypes),
          backgroundColor: [
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'
          ]
        }
      ]
    };
    
    // Confidence distribution
    const confidenceLevels = Object.values(predictions).map(p => Math.round(p.confidence * 100));
    const confidenceData = {
      labels: ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'],
      datasets: [
        {
          label: 'Predictions',
          data: [
            confidenceLevels.filter(c => c <= 20).length,
            confidenceLevels.filter(c => c > 20 && c <= 40).length,
            confidenceLevels.filter(c => c > 40 && c <= 60).length,
            confidenceLevels.filter(c => c > 60 && c <= 80).length,
            confidenceLevels.filter(c => c > 80).length
          ],
          backgroundColor: [
            '#9CA3AF', '#6B7280', '#4B5563', '#374151', '#1F2937'
          ]
        }
      ]
    };
    
    return {
      maintenanceStatus,
      componentHealth,
      maintenanceTypeData,
      confidenceData
    };
  };
  
  const chartData = getChartData();
  
  // Chart options
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
        text: 'Component Health Status'
      }
    }
  };
  
  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Maintenance Type Distribution'
      }
    }
  };
  
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Prediction Confidence Distribution'
      }
    }
  };

  // Get vehicle by ID
  const getVehicleById = (id) => {
    return vehicles.find(vehicle => vehicle.id === id) || {};
  };

  // Get maintenance status color
  const getMaintenanceStatusColor = (needsMaintenance) => {
    return needsMaintenance ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 mb-2">
          AI Predictive Maintenance Dashboard
        </h1>
        <p className="text-lg text-gray-700">
          Advanced machine learning-powered vehicle health monitoring and maintenance prediction
        </p>
        {/* Action Buttons */}
        <div className="mt-4 flex flex-wrap gap-4">
          <button 
            onClick={fetchAIPredictions}
            disabled={predictionsLoading}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition hover:scale-105 duration-300 ease-in-out disabled:opacity-50"
          >
            {predictionsLoading ? 'Analyzing with AI...' : 'Run AI Predictions'}
          </button>
          <button 
            onClick={trainAIModel}
            disabled={predictionsLoading}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition hover:scale-105 duration-300 ease-in-out disabled:opacity-50"
          >
            {predictionsLoading ? 'Training Model...' : 'Train AI Model'}
          </button>
        </div>
        {modelTrained && (
          <div className="mt-2 text-sm text-emerald-600 font-medium">
            AI model successfully trained!
          </div>
        )}
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading vehicle data...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-blue-600 mb-2">{vehicles.length}</div>
          <div className="text-gray-700">Total Vehicles</div>
        </div>
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-red-600 mb-2">
            {Object.values(predictions).filter(p => p.needsMaintenance).length}
          </div>
          <div className="text-gray-700">Maintenance Required</div>
        </div>
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-emerald-600 mb-2">
            {Math.round(Object.values(predictions).filter(p => p.confidence > 0.8).length * 100 / Math.max(1, Object.keys(predictions).length))}%
          </div>
          <div className="text-gray-700">High Confidence</div>
        </div>
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-amber-600 mb-2">
            {Object.keys(predictions).length}
          </div>
          <div className="text-gray-700">AI Predictions</div>
        </div>
      </div>

      {/* Charts Section */}
      {Object.keys(predictions).length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-xl h-96">
              <Pie data={chartData.maintenanceStatus} options={pieChartOptions} />
            </div>
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-xl h-96">
              <Doughnut data={chartData.maintenanceTypeData} options={doughnutChartOptions} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-xl h-96">
              <Bar data={chartData.componentHealth} options={barChartOptions} />
            </div>
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-xl h-96">
              <Line data={chartData.confidenceData} options={lineChartOptions} />
            </div>
          </div>
        </>
      )}

      {/* AI Predictions Table */}
      {Object.keys(predictions).length > 0 && (
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-xl mb-8">
          <h2 className="text-2xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 mb-6">
            Detailed AI Predictions
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                  <th className="py-3 px-4 text-left">Vehicle</th>
                  <th className="py-3 px-4 text-left">Maintenance Needed</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Days Until</th>
                  <th className="py-3 px-4 text-left">Probability</th>
                  <th className="py-3 px-4 text-left">Confidence</th>
                  <th className="py-3 px-4 text-left">Components</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(predictions).map(([vehicleId, prediction]) => {
                  const vehicle = getVehicleById(parseInt(vehicleId));
                  return (
                    <tr key={vehicleId} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-bold">{vehicle.vehicleNumber || `Vehicle ${vehicleId}`}</div>
                          <div className="text-gray-600 text-sm">{vehicle.manufacturer} {vehicle.model}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getMaintenanceStatusColor(prediction.needsMaintenance)}`}>
                          {prediction.needsMaintenance ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium">{prediction.maintenanceType}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold">{prediction.predictedDays} days</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600" 
                              style={{ width: `${Math.round(prediction.probability * 100)}%` }}
                            ></div>
                          </div>
                          <span>{Math.round(prediction.probability * 100)}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600" 
                              style={{ width: `${Math.round(prediction.confidence * 100)}%` }}
                            ></div>
                          </div>
                          <span>{Math.round(prediction.confidence * 100)}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(prediction.components || {}).map(([component, status]) => (
                            <span 
                              key={component} 
                              className={`px-2 py-1 rounded-full text-xs ${
                                status.includes('Good') || status.includes('N/A') 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : status.includes('Attention') || status.includes('Check') || status.includes('Monitor')
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {component}: {status}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recommended Actions */}
      {Object.keys(predictions).length > 0 && (
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 mb-6">
            Recommended Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(predictions)
              .filter(([_, prediction]) => prediction.needsMaintenance)
              .slice(0, 6)
              .map(([vehicleId, prediction]) => {
                const vehicle = getVehicleById(parseInt(vehicleId));
                return (
                  <div key={vehicleId} className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
                    <h3 className="font-bold text-lg text-gray-800 mb-3">
                      {vehicle.vehicleNumber || `Vehicle ${vehicleId}`}
                    </h3>
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-bold bg-red-100 text-red-800">
                        {prediction.maintenanceType}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      Schedule within <span className="font-bold">{prediction.predictedDays} days</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Recommended Actions:</h4>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        {prediction.recommendedActions && prediction.recommendedActions.slice(0, 3).map((action, index) => (
                          <li key={index} className="text-gray-600">{action}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            
            {Object.entries(predictions).filter(([_, prediction]) => prediction.needsMaintenance).length === 0 && (
              <div className="col-span-full text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600">No immediate maintenance actions required. All vehicles are in good condition!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDashboard;