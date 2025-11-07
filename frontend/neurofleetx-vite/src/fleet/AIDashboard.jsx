import React, { useState, useEffect } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
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
import { aiModelService, vehicleService } from '../backend/api';

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
  const [vehicles, setVehicles] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Fetch vehicles and run AI analysis
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch vehicles
        const vehiclesResponse = await vehicleService.getAllVehicles();
        setVehicles(vehiclesResponse.data);
        
        // Run AI analysis
        const predictionsResponse = await aiModelService.predictAllVehicles();
        setPredictions(predictionsResponse.data.predictions || {});
        setAnalysisComplete(true);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data from the backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Chart data for maintenance predictions
  const maintenanceChartData = {
    labels: ['No Maintenance Needed', 'Maintenance Required'],
    datasets: [
      {
        label: 'Vehicles',
        data: [
          Object.values(predictions).filter(p => !p.needsMaintenance).length,
          Object.values(predictions).filter(p => p.needsMaintenance).length
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Chart data for component health
  const componentHealthData = {
    labels: ['Engine', 'Battery', 'Tires', 'Brakes'],
    datasets: [
      {
        label: 'Good Condition',
        data: [
          vehicles.filter((_, i) => {
            const prediction = predictions[vehicles[i]?.id];
            return prediction?.components?.engine === 'Good';
          }).length,
          vehicles.filter((_, i) => {
            const prediction = predictions[vehicles[i]?.id];
            return prediction?.components?.battery === 'Good';
          }).length,
          vehicles.filter((_, i) => {
            const prediction = predictions[vehicles[i]?.id];
            return prediction?.components?.tires === 'Good';
          }).length,
          vehicles.filter((_, i) => {
            const prediction = predictions[vehicles[i]?.id];
            return prediction?.components?.brakes === 'Good';
          }).length
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Maintenance timeline data
  const timelineData = {
    labels: ['0-7 days', '8-14 days', '15-30 days', '30+ days'],
    datasets: [
      {
        label: 'Vehicles Needing Maintenance',
        data: [
          Object.values(predictions).filter(p => p.needsMaintenance && p.predictedDays <= 7).length,
          Object.values(predictions).filter(p => p.needsMaintenance && p.predictedDays > 7 && p.predictedDays <= 14).length,
          Object.values(predictions).filter(p => p.needsMaintenance && p.predictedDays > 14 && p.predictedDays <= 30).length,
          Object.values(predictions).filter(p => p.needsMaintenance && p.predictedDays > 30).length
        ],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }
    ]
  };

  // Chart options
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Maintenance Requirements'
      }
    }
  };

  const barOptions = {
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

  const timelineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Maintenance Timeline'
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800">AI Model Analyzing Fleet Data...</h2>
          <p className="text-gray-600 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition hover:scale-105 duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 text-gray-800 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 mb-2">
          AI Predictive Maintenance Dashboard
        </h1>
        <p className="text-lg text-gray-700">
          Advanced analytics and predictions for your fleet health
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-cyan-600 mb-2">{vehicles.length}</div>
          <div className="text-gray-700">Total Vehicles</div>
        </div>
        <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-red-600 mb-2">
            {Object.values(predictions).filter(p => p.needsMaintenance).length}
          </div>
          <div className="text-gray-700">Vehicles Needing Maintenance</div>
        </div>
        <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-amber-600 mb-2">
            {Math.round(Object.values(predictions).filter(p => p.needsMaintenance).length / vehicles.length * 100) || 0}%
          </div>
          <div className="text-gray-700">Maintenance Risk</div>
        </div>
        <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl p-6 shadow-lg">
          <div className="text-3xl font-bold text-emerald-600 mb-2">
            {Math.round(Object.values(predictions).reduce((sum, p) => sum + (p.predictedDays || 0), 0) / Object.values(predictions).length) || 30}
          </div>
          <div className="text-gray-700">Avg. Days Until Maintenance</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="bg-gradient-to-br from-white to-cyan-50 rounded-3xl p-6 shadow-xl h-80">
          <Doughnut data={maintenanceChartData} options={doughnutOptions} />
        </div>
        <div className="bg-gradient-to-br from-white to-cyan-50 rounded-3xl p-6 shadow-xl h-80">
          <Bar data={componentHealthData} options={barOptions} />
        </div>
        <div className="bg-gradient-to-br from-white to-cyan-50 rounded-3xl p-6 shadow-xl h-80">
          <Bar data={timelineData} options={timelineOptions} />
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-br from-white to-cyan-50 rounded-3xl p-8 shadow-xl mb-8">
        <h2 className="text-2xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 mb-6">
          AI Recommendations
        </h2>
        {Object.values(predictions).filter(p => p.needsMaintenance).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.filter((_, i) => {
              const prediction = predictions[vehicles[i]?.id];
              return prediction?.needsMaintenance;
            }).map(vehicle => {
              const prediction = predictions[vehicle.id];
              return (
                <div key={vehicle.id} className="bg-white rounded-2xl p-6 shadow-lg border border-cyan-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{vehicle.vehicleNumber}</h3>
                      <p className="text-gray-600 text-sm">{vehicle.manufacturer} {vehicle.model}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                      {prediction.predictedDays} days
                    </span>
                  </div>
                  <div className="mb-4">
                    <p className="font-semibold text-amber-600">{prediction.maintenanceType}</p>
                    <p className="text-sm text-gray-600 mt-1">{prediction.recommendedActions?.[0] || 'Maintenance recommended'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {prediction.recommendedActions?.slice(0, 2).map((action, index) => (
                      <span key={index} className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs">
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-800 mb-2">All Vehicles in Good Condition</h3>
            <p className="text-gray-600">No immediate maintenance required according to AI analysis</p>
          </div>
        )}
      </div>

      {/* Model Information */}
      <div className="bg-gradient-to-br from-white to-cyan-50 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 mb-6">
          AI Model Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-cyan-50 rounded-2xl p-6">
            <h3 className="font-bold text-lg text-cyan-800 mb-2">Predictive Algorithm</h3>
            <p className="text-gray-700 text-sm">
              Our AI model analyzes vehicle telemetry data including battery levels, fuel levels, 
              mileage, and health scores to predict maintenance needs.
            </p>
          </div>
          <div className="bg-cyan-50 rounded-2xl p-6">
            <h3 className="font-bold text-lg text-cyan-800 mb-2">Accuracy</h3>
            <p className="text-gray-700 text-sm">
              Current model confidence: 85%. The model continuously learns from new data to 
              improve predictions over time.
            </p>
          </div>
          <div className="bg-cyan-50 rounded-2xl p-6">
            <h3 className="font-bold text-lg text-cyan-800 mb-2">Last Analysis</h3>
            <p className="text-gray-700 text-sm">
              {analysisComplete ? `Completed just now` : 'Analysis pending'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDashboard;