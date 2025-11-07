import axios from 'axios';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:8083/api', // Spring Boot backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      // Only redirect if we're not on the login page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Vehicle API endpoints
export const vehicleService = {
  // Get all vehicles
  getAllVehicles: () => api.get('/vehicles'),
  
  // Get vehicle by ID
  getVehicleById: (id) => api.get(`/vehicles/${id}`),
  
  // Create new vehicle
  createVehicle: (vehicleData) => api.post('/vehicles', vehicleData),
  
  // Update vehicle
  updateVehicle: (id, vehicleData) => api.put(`/vehicles/${id}`, vehicleData),
  
  // Delete vehicle
  deleteVehicle: (id) => api.delete(`/vehicles/${id}`),
  
  // Get vehicles by status
  getVehiclesByStatus: (status) => api.get(`/vehicles/status/${status}`)
};

// AI Model API endpoints
export const aiModelService = {
  // Predict maintenance for a specific vehicle
  predictMaintenance: (vehicleId) => api.post('/ai/predict/maintenance', { vehicleId }),
  
  // Get predictions for all vehicles
  predictAllVehicles: () => api.get('/ai/predict/maintenance/all'),
  
  // Train the AI model
  trainModel: () => api.post('/ai/train')
};

// User API endpoints
export const userService = {
  // User signup
  signup: (userData) => api.post('/auth/register', userData),
  
  // User login
  login: (credentials) => api.post('/auth/login', credentials),
  
  // User logout
  logout: () => api.post('/users/logout'),
  
  // Get current user
  getCurrentUser: () => api.get('/users/me'),
  
  // Update current user
  updateCurrentUser: (userData) => api.put('/users/me', userData),
  
  // Get user by ID
  getUserById: (id) => api.get(`/users/${id}`),
  
  // Update user by ID
  updateUserById: (id, userData) => api.put(`/users/${id}`, userData),
  
  // Delete user by ID
  deleteUserById: (id) => api.delete(`/users/${id}`)
};

// Function to set the auth token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

// Function to get the current user's role
export const getCurrentUserRole = () => {
  return localStorage.getItem('userRole');
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export default api;