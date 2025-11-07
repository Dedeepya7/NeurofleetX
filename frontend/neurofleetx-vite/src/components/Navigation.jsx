import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  // Get role from localStorage or default to 'customer'
  const userRole = localStorage.getItem('userRole') || 'customer';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Fleet Inventory', path: '/vehicles', icon: '🚗' },
    { name: 'Telemetry', path: '/telemetry', icon: '📡' },
    { name: 'Route Optimization', path: '/routes', icon: '🛣️' },
    { name: 'Maintenance', path: '/maintenance', icon: '🔧' },
    { name: 'AI Dashboard', path: '/ai-dashboard', icon: '🤖' }
  ];

  return (
    <nav className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="bg-white text-cyan-600 p-2 rounded-lg font-bold text-xl mr-4">
              NF
            </div>
            <h1 className="text-xl font-bold">NeuroFleetX</h1>
            <span className="ml-4 px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'bg-white text-cyan-600 shadow-lg'
                      : 'text-white hover:bg-cyan-500 hover:bg-opacity-50'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="md:hidden">
            <button className="text-white focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;