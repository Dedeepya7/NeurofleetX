import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { userService, setAuthToken, getCurrentUserRole } from '../backend/api';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedRole = location.state?.role || 'customer';
  
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    role: selectedRole
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Attempt to login with the backend
      const response = await userService.login(credentials);
      
      if (response.data.token) {
        // Store the token and role in localStorage
        setAuthToken(response.data.token);
        localStorage.setItem('userRole', credentials.role);
        localStorage.setItem('userId', response.data.id);
        localStorage.setItem('username', response.data.username);
        
        // Navigate to dashboard after successful login
        navigate('/dashboard', { state: { role: credentials.role } });
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Invalid username or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    // Navigate to registration page
    navigate('/register');
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setAuthToken(null);
    // Navigate back to welcome page
    navigate('/');
  };

  // Function to get the appropriate SVG icon based on role
  const getRoleIcon = () => {
    switch(credentials.role) {
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
    switch(credentials.role) {
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
            <div className="flex justify-between items-center mb-6">
              <div className="flex justify-center">
                <div className={`bg-gradient-to-r ${getRoleGradient()} text-white p-4 rounded-2xl animate-bounce`}>
                  {getRoleIcon()}
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg hover:from-red-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg font-bold transform hover:scale-110"
              >
                Logout
              </button>
            </div>
            <h1 className="text-4xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 animate-pulse">
              AI Powered Fleet Management
            </h1>
            <p className="text-gray-700 text-lg bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
              {credentials.role.charAt(0).toUpperCase() + credentials.role.slice(1)} Login
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <label className="block text-gray-800 text-lg font-medium mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={credentials.username}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-800 text-lg shadow-inner transform hover:scale-105 transition-transform duration-300"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="mb-8">
              <label className="block text-gray-800 text-lg font-medium mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-800 text-lg shadow-inner transform hover:scale-105 transition-transform duration-300"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-gray-800 text-lg font-medium mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600" htmlFor="role">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={credentials.role}
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
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-700 text-lg">
              Don't have an account?{' '}
              <button
                onClick={handleRegister}
                className="text-cyan-600 hover:text-cyan-700 font-bold focus:outline-none bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;