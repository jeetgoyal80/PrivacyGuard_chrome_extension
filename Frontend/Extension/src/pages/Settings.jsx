import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function Settings() {
  const nav = useNavigate();

  const [form, setForm] = useState({ username: '', email: '' });
  const [originalForm, setOriginalForm] = useState({ username: '', email: '' }); // keep original to reset on cancel
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/user/profile');
        setForm({ username: data.username, email: data.email });
        setOriginalForm({ username: data.username, email: data.email });
      } catch {
        setError('Failed to load profile');
      }
    })();
  }, []);

  // Update profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    setLoading(true);

    try {
      // Only send username since email is not editable
      await api.put('/user/profile', { username: form.username });
      setMsg('Profile updated successfully');
      setOriginalForm(form);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setForm(originalForm);
    setError('');
    setMsg('');
    setEditing(false);
  };

  // Delete account
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    try {
      await api.delete('/user/delete');
      localStorage.removeItem('token');
      nav('/');
    } catch {
      setError('Failed to delete account');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
          <h2 className="text-4xl font-extrabold text-indigo-700 tracking-tight text-center">
            Account Settings
          </h2>

          {msg && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md shadow-sm"
              role="alert"
            >
              {msg}
            </div>
          )}
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-sm"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* View Mode */}
          {!editing && (
            <div className="space-y-5">
              <div>
                <p className="text-gray-700 font-semibold">Username</p>
                <p className="mt-1 text-gray-900 text-lg">{form.username}</p>
              </div>

              <div>
                <p className="text-gray-700 font-semibold">Email</p>
                <p className="mt-1 text-gray-900 text-lg">{form.email}</p>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setEditing(true)}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md transition"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-md transition"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Edit Mode */}
          {editing && (
            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
                  required
                  disabled={loading}
                  className="w-full rounded-md border border-gray-300 p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-50"
                  placeholder="Your username"
                  autoComplete="username"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                  Email (cannot be changed)
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  disabled
                  className="w-full rounded-md border border-gray-300 p-3 text-gray-700 bg-gray-100 cursor-not-allowed"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md transition disabled:opacity-50"
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-5 w-5 mx-auto text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                  ) : (
                    'Save'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold rounded-md shadow-md transition disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
