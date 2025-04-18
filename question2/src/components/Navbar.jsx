import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold">Social Analytics</Link>
          </div>
          <div className="flex space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md ${location.pathname === '/' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
            >
              Feed
            </Link>
            <Link 
              to="/top-users" 
              className={`px-3 py-2 rounded-md ${location.pathname === '/top-users' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
            >
              Top Users
            </Link>
            <Link 
              to="/trending" 
              className={`px-3 py-2 rounded-md ${location.pathname === '/trending' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
            >
              Trending Posts
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
