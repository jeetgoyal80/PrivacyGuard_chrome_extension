import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-700">
          ExtensPro
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link to="/" className="text-gray-700 hover:text-blue-700 transition font-medium">
            Home
          </Link>

          {isLoggedIn && (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-700 transition font-medium">
                Dashboard
              </Link>
              <Link to="/settings" className="text-gray-700 hover:text-blue-700 transition font-medium">
                Settings
              </Link>
            </>
          )}

          {!isLoggedIn && (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-700 transition font-medium">
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition font-medium"
              >
                Register
              </Link>
            </>
          )}

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition font-medium"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden flex items-center text-blue-700"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white px-6 py-4 shadow-md space-y-4">
          <Link
            to="/"
            className="block text-gray-700 hover:text-blue-700 font-medium"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          {isLoggedIn && (
            <>
              <Link
                to="/dashboard"
                className="block text-gray-700 hover:text-blue-700 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/settings"
                className="block text-gray-700 hover:text-blue-700 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition font-medium"
              >
                Logout
              </button>
            </>
          )}

          {!isLoggedIn && (
            <>
              <Link
                to="/login"
                className="block text-gray-700 hover:text-blue-700 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition text-center font-medium"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
