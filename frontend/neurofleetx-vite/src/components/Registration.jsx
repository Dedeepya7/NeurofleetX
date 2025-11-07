import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../backend/api';

const Registration = () => {
  const navigate = useNavigate();
  
  const [registrationData, setRegistrationData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'customer'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (registrationData.password !== registrationData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Prepare data for registration (exclude confirmPassword)
      const { confirmPassword, ...userData } = registrationData;
      
      // Attempt to register with the backend
      const response = await userService.signup(userData);
      console.log('Registration response:', response);
      
      setSuccess('Registration successful! You can now login.');
      
      // Clear form after successful registration
      setRegistrationData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        role: 'customer'
      });
      
      // Optionally navigate to login page after a delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      // Log detailed error information for debugging
      console.error('Registration error (full):', err);
      console.error('Registration error (response):', err.response);
      
      // Store debug info for UI display
      setDebugInfo({
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      });

      // If server sent a JSON error body, prefer that message; otherwise show status/text
      const serverMessage = err.response?.data?.message || err.response?.data || err.response?.statusText;
      setError(serverMessage || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    // Navigate to login page
    navigate('/login');
  };

  // Function to get the appropriate SVG icon based on role
  const getRoleIcon = () => {
    switch(registrationData.role) {
      case 'admin':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'manager':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        );
      case 'driver':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            {/* Adding a steering wheel icon for driver */}
            <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
            <line x1="12" y1="12" x2="12" y2="6" strokeWidth={1.5} />
            <line x1="12" y1="12" x2="16" y2="12" strokeWidth={1.5} />
          </svg>
        );
      case 'customer':
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
    }
  };

  // Function to get the appropriate color gradient based on role
  const getRoleGradient = () => {
    switch(registrationData.role) {
      case 'admin':
        return 'from-cyan-500 to-blue-600';
      case 'manager':
        return 'from-cyan-500 to-blue-600';
      case 'driver':
        return 'from-orange-500 to-amber-600';
      case 'customer':
      default:
        return 'from-cyan-500 to-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center p-6">
      <div className="bg-gradient-to-br from-white to-cyan-50 rounded-3xl shadow-2xl overflow-hidden w-full max-w-md border border-cyan-100 transform hover:scale-105 transition-transform duration-300">
        <div className="p-10">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className={`bg-gradient-to-r ${getRoleGradient()} text-white p-4 rounded-2xl animate-bounce`}>
                {getRoleIcon()}
              </div>
            </div>
            <h1 className="text-4xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 animate-pulse">
              AI Powered Fleet Management
            </h1>
            <p className="text-gray-700 text-lg bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
              Create Account
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Debug Panel - only shown when there's an error */}
          {debugInfo && (
            <div className="mb-4 p-4 bg-gray-100 rounded-lg text-sm font-mono overflow-auto">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-gray-700 font-bold">Debug Information</h3>
                <button 
                  onClick={() => setDebugInfo(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>
              <pre className="whitespace-pre-wrap break-words text-xs">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-800 text-lg font-medium mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600" htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={registrationData.firstName}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-800 text-lg shadow-inner transform hover:scale-105 transition-transform duration-300"
                placeholder="Enter your first name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-800 text-lg font-medium mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600" htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={registrationData.lastName}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-800 text-lg shadow-inner transform hover:scale-105 transition-transform duration-300"
                placeholder="Enter your last name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-800 text-lg font-medium mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={registrationData.username}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-800 text-lg shadow-inner transform hover:scale-105 transition-transform duration-300"
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-800 text-lg font-medium mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={registrationData.email}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-800 text-lg shadow-inner transform hover:scale-105 transition-transform duration-300"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-800 text-lg font-medium mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600" htmlFor="phoneNumber">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={registrationData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-800 text-lg shadow-inner transform hover:scale-105 transition-transform duration-300"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-800 text-lg font-medium mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={registrationData.password}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-800 text-lg shadow-inner transform hover:scale-105 transition-transform duration-300"
                placeholder="Create a password"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-800 text-lg font-medium mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={registrationData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-800 text-lg shadow-inner transform hover:scale-105 transition-transform duration-300"
                placeholder="Confirm your password"
                required
              />
            </div>

            <div className="mb-8">
              <label className="block text-gray-800 text-lg font-medium mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600" htmlFor="role">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={registrationData.role}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-800 text-lg shadow-inner transform hover:scale-105 transition-transform duration-300"
              >
                <option value="admin" className="bg-cyan-100">Admin</option>
                <option value="manager" className="bg-emerald-100">Manager</option>
                <option value="driver" className="bg-amber-100">Driver</option>
                <option value="customer" className="bg-purple-100">Customer</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-700 text-lg">
              Already have an account?{' '}
              <button
                onClick={handleLogin}
                className="text-cyan-600 hover:text-cyan-700 font-bold focus:outline-none bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;