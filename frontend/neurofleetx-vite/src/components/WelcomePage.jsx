import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate('/login', { state: { role } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-5 rounded-3xl shadow-xl animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
        <h1 className="text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 animate-bounce">
          AI Powered Fleet Management
        </h1>
        <p className="text-2xl text-gray-700 max-w-3xl mx-auto font-light bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
          Intelligent urban mobility and fleet operations platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl w-full">
        {/* Admin Card */}
        <div 
          className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-3 border-t-4 border-cyan-500"
          onClick={() => handleRoleSelect('admin')}
        >
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full p-6 mb-6 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold mb-4 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">Admin</h3>
            <p className="text-gray-700 text-center text-lg">
              Full system access with KPIs, analytics, and user management
            </p>
          </div>
        </div>

        {/* Manager Card */}
        <div 
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-3 border-t-4 border-emerald-500"
          onClick={() => handleRoleSelect('manager')}
        >
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full p-6 mb-6 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold mb-4 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">Manager</h3>
            <p className="text-gray-700 text-center text-lg">
              Fleet operations, route allocation, and maintenance scheduling
            </p>
          </div>
        </div>

        {/* Driver Card */}
        <div 
          className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-3 border-t-4 border-amber-500"
          onClick={() => handleRoleSelect('driver')}
        >
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full p-6 mb-6 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold mb-4 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600">Driver</h3>
            <p className="text-gray-700 text-center text-lg">
              Trip management and real-time route updates
            </p>
          </div>
        </div>

        {/* Customer Card */}
        <div 
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-3 border-t-4 border-purple-500"
          onClick={() => handleRoleSelect('customer')}
        >
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-6 mb-6 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold mb-4 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Customer</h3>
            <p className="text-gray-700 text-center text-lg">
              Vehicle booking with AI-powered recommendations
            </p>
          </div>
        </div>
      </div>

      <div className="mt-20 text-gray-600 text-lg">
        <p className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 font-bold">Select a role to continue</p>
      </div>
    </div>
  );
};

export default WelcomePage;