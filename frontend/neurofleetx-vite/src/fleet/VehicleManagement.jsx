import React, { useState, useEffect } from 'react';
import { vehicleService } from '../backend/api';
import { useNavigate } from 'react-router-dom';

const VehicleManagement = () => {
  const navigate = useNavigate();
  
  // Vehicle data from backend
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    model: '',
    manufacturer: '',
    type: 'SEDAN',
    status: 'AVAILABLE',
    batteryLevel: '',
    fuelLevel: '',
    latitude: '',
    longitude: '',
    healthScore: ''
  });

  // Fetch vehicles from backend
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehicleService.getAllVehicles();
      setVehicles(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      if (err.response?.status === 401) {
        setError('Authentication required. Please log in.');
        // Redirect to login page
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError('Failed to fetch vehicles from the backend. Using empty list.');
        setVehicles([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Status colors
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Open modal for adding a new vehicle
  const openAddModal = () => {
    setFormData({
      vehicleNumber: '',
      model: '',
      manufacturer: '',
      type: 'SEDAN',
      status: 'AVAILABLE',
      batteryLevel: '',
      fuelLevel: '',
      latitude: '',
      longitude: '',
      healthScore: ''
    });
    setCurrentVehicle(null);
    setIsEditing(false);
    setShowModal(true);
  };

  // Open modal for editing a vehicle
  const openEditModal = (vehicle) => {
    setFormData({
      ...vehicle,
      batteryLevel: vehicle.batteryLevel || '',
      fuelLevel: vehicle.fuelLevel || ''
    });
    setCurrentVehicle(vehicle);
    setIsEditing(true);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Save vehicle (add or update)
  const saveVehicle = async (e) => {
    e.preventDefault();
    
    try {
      const vehicleData = {
        ...formData,
        batteryLevel: formData.batteryLevel === '' ? null : parseInt(formData.batteryLevel),
        fuelLevel: formData.fuelLevel === '' ? null : parseInt(formData.fuelLevel),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        healthScore: parseInt(formData.healthScore)
      };

      if (isEditing) {
        // Update existing vehicle
        await vehicleService.updateVehicle(vehicleData.id, vehicleData);
      } else {
        // Add new vehicle
        await vehicleService.createVehicle(vehicleData);
      }
      
      // Refresh the vehicle list
      await fetchVehicles();
      closeModal();
    } catch (err) {
      console.error('Error saving vehicle:', err);
      setError('Failed to save vehicle.');
    }
  };

  // Delete vehicle
  const deleteVehicle = async (id) => {
    try {
      await vehicleService.deleteVehicle(id);
      // Refresh the vehicle list
      await fetchVehicles();
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      setError('Failed to delete vehicle.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 text-gray-800 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 text-gray-800 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 mb-2">
          Fleet Inventory Management
        </h1>
        <p className="text-lg text-gray-700">
          Manage your vehicle fleet with real-time telemetry and status tracking
        </p>
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
            {error}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-4">
          <button 
            onClick={openAddModal}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-bold text-lg flex items-center transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Vehicle
          </button>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search vehicles..."
            className="px-6 py-3 bg-white rounded-xl shadow-lg border border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-80"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute right-4 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-gradient-to-br from-white to-cyan-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-cyan-100 transform hover:-translate-y-3">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">
                  {vehicle.manufacturer} {vehicle.model}
                </h3>
                <p className="text-gray-700 text-lg">{vehicle.vehicleNumber}</p>
                <p className="text-gray-600 text-md mt-1">{vehicle.type}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg ${getStatusColor(vehicle.status)} transform hover:scale-105 transition-transform duration-300`}>
                {getStatusText(vehicle.status)}
              </span>
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
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-4 rounded-full" 
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
                      className="bg-gradient-to-r from-amber-500 to-orange-600 h-4 rounded-full" 
                      style={{ width: `${vehicle.fuelLevel}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Location and Actions */}
            <div className="flex justify-between items-center">
              <div className="text-gray-700 text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Location
              </div>
              <div className="space-x-3">
                <button 
                  onClick={() => openEditModal(vehicle)}
                  className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-colors text-lg font-bold shadow-inner transform hover:scale-105"
                >
                  Edit
                </button>
                <button 
                  onClick={() => deleteVehicle(vehicle.id)}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg hover:from-red-600 hover:to-orange-700 transition-all duration-300 font-bold text-lg shadow-lg transform hover:scale-105"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {vehicles.length === 0 && !loading && (
          <div className="col-span-full text-center py-12">
            <div className="bg-gradient-to-br from-white to-cyan-50 rounded-3xl p-8 shadow-xl border border-cyan-100 max-w-2xl mx-auto">
              <div className="text-6xl mb-6">🚛</div>
              <h3 className="text-2xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 mb-4">
                No Vehicles Found
              </h3>
              <p className="text-gray-700 mb-6">
                There are currently no vehicles in your fleet. Add your first vehicle to get started.
              </p>
              <button 
                onClick={openAddModal}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-bold text-lg flex items-center mx-auto transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Your First Vehicle
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Vehicle Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">
                  {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
                </h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={saveVehicle}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-gray-700 text-lg font-bold mb-2">Vehicle Number *</label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-lg font-bold mb-2">Manufacturer *</label>
                    <input
                      type="text"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-lg font-bold mb-2">Model *</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-lg font-bold mb-2">Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    >
                      <option value="SEDAN">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="VAN">Van</option>
                      <option value="TRUCK">Truck</option>
                      <option value="MOTORCYCLE">Motorcycle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-lg font-bold mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="IN_USE">In Use</option>
                      <option value="MAINTENANCE">Needs Service</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-lg font-bold mb-2">Health Score (%)</label>
                    <input
                      type="number"
                      name="healthScore"
                      value={formData.healthScore}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-lg font-bold mb-2">Battery Level (%)</label>
                    <input
                      type="number"
                      name="batteryLevel"
                      value={formData.batteryLevel}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Leave empty for fuel vehicles"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-lg font-bold mb-2">Fuel Level (%)</label>
                    <input
                      type="number"
                      name="fuelLevel"
                      value={formData.fuelLevel}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Leave empty for electric vehicles"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-lg font-bold mb-2">Latitude</label>
                    <input
                      type="number"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      step="any"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-lg font-bold mb-2">Longitude</label>
                    <input
                      type="number"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      step="any"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 rounded-xl hover:from-gray-400 hover:to-gray-500 transition-all duration-300 font-bold text-lg shadow-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 font-bold text-lg shadow-lg"
                  >
                    {isEditing ? 'Update Vehicle' : 'Add Vehicle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;