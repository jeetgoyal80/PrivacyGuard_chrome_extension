import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="backdrop-blur-md bg-white/70 shadow-lg sticky top-0 z-50 border-b border-blue-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 text-2xl font-extrabold text-blue-700 tracking-wide">
          <img
            src="ep.jpeg"
            alt="Logo"
            className="h-10 w-10 rounded-xl shadow-md"
          />
          ExtensPro
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link
            to="/"
            className={`relative transition transform hover:scale-105 font-medium
              ${
                isActive('/')
                  ? 'text-blue-700 font-semibold after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-blue-700 after:w-full after:rounded'
                  : 'text-gray-700 hover:text-blue-700 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-blue-700 after:w-0 hover:after:w-full after:rounded after:transition-all after:duration-300'
              }
            `}
          >
            Home
          </Link>

          {isLoggedIn && (
            <>
              <Link
                to="/dashboard"
                className={`relative transition transform hover:scale-105 font-medium
                  ${
                    isActive('/dashboard')
                      ? 'text-blue-700 font-semibold after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-blue-700 after:w-full after:rounded'
                      : 'text-gray-700 hover:text-blue-700 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-blue-700 after:w-0 hover:after:w-full after:rounded after:transition-all after:duration-300'
                  }
                `}
              >
                Dashboard
              </Link>
              <Link
                to="/settings"
                className={`relative transition transform hover:scale-105 font-medium
                  ${
                    isActive('/settings')
                      ? 'text-blue-700 font-semibold after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-blue-700 after:w-full after:rounded'
                      : 'text-gray-700 hover:text-blue-700 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-blue-700 after:w-0 hover:after:w-full after:rounded after:transition-all after:duration-300'
                  }
                `}
              >
                Settings
              </Link>
            </>
          )}

          {!isLoggedIn && (
            <>
              <Link
                to="/login"
                className={`relative transition transform hover:scale-105 font-medium
                  ${
                    isActive('/login')
                      ? 'text-blue-700 font-semibold after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-blue-700 after:w-full after:rounded'
                      : 'text-gray-700 hover:text-blue-700 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-blue-700 after:w-0 hover:after:w-full after:rounded after:transition-all after:duration-300'
                  }
                `}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition transform hover:scale-105 font-medium"
              >
                Register
              </Link>
            </>
          )}

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition transform hover:scale-105 font-medium"
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu with animation */}
      <div
        className={`md:hidden bg-white px-6 transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-[400px] py-4 opacity-100' : 'max-h-0 py-0 opacity-0'
        }`}
      >
        <Link
          to="/"
          onClick={() => setIsOpen(false)}
          className={`relative block py-2 font-medium transition transform hover:scale-105
            ${
              isActive('/')
                ? 'text-blue-700 font-semibold after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-blue-700 after:w-full after:rounded'
                : 'text-gray-700 hover:text-blue-700 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-blue-700 after:w-0 hover:after:w-full after:rounded after:transition-all after:duration-300'
            }
          `}
        >
          Home
        </Link>

        {isLoggedIn && (
          <>
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className={`relative block py-2 font-medium transition transform hover:scale-105
                ${
                  isActive('/dashboard')
                    ? 'text-blue-700 font-semibold after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-blue-700 after:w-full after:rounded'
                    : 'text-gray-700 hover:text-blue-700 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-blue-700 after:w-0 hover:after:w-full after:rounded after:transition-all after:duration-300'
                }
              `}
            >
              Dashboard
            </Link>
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className={`relative block py-2 font-medium transition transform hover:scale-105
                ${
                  isActive('/settings')
                    ? 'text-blue-700 font-semibold after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-blue-700 after:w-full after:rounded'
                    : 'text-gray-700 hover:text-blue-700 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-blue-700 after:w-0 hover:after:w-full after:rounded after:transition-all after:duration-300'
                }
              `}
            >
              Settings
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full text-left mt-2 px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition transform hover:scale-105 font-medium"
            >
              Logout
            </button>
          </>
        )}

        {!isLoggedIn && (
          <>
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className={`relative block py-2 font-medium transition transform hover:scale-105
                ${
                  isActive('/login')
                    ? 'text-blue-700 font-semibold after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-blue-700 after:w-full after:rounded'
                    : 'text-gray-700 hover:text-blue-700 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-blue-700 after:w-0 hover:after:w-full after:rounded after:transition-all after:duration-300'
                }
              `}
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center mt-2 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition transform hover:scale-105 font-medium"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
