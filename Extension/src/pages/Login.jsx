import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100 px-4 animate-fadeIn">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-[1.02]">
          <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800 animate-fadeIn">
            Welcome Back
          </h2>

          {error && (
            <p className="mb-4 text-center text-red-600 font-medium bg-red-100 py-2 rounded animate-fadeIn">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition duration-300 ease-in-out
                hover:shadow-md hover:scale-[1.02]"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition duration-300 ease-in-out
                hover:shadow-md hover:scale-[1.02]"
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md
                hover:bg-blue-700 transition duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-[1.03]"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 animate-fadeIn">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
