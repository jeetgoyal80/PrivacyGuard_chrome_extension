import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings2, User2, Mail, Trash2, Edit2, Save, XCircle, Menu } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function Settings() {
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const [form, setForm] = useState({ username: '', email: '' });
  const [originalForm, setOriginalForm] = useState({ username: '', email: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    setLoading(true);
    try {
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

  const handleCancel = () => {
    setForm(originalForm);
    setError('');
    setMsg('');
    setEditing(false);
  };

  const handleDelete = async () => {
    setMsg('');
    setError('');
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
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className={`bg-white border-r border-gray-200 ${menuOpen ? 'block' : 'hidden'} md:block md:w-64`}>
          <div className="px-6 py-8">
            <div className="flex items-center justify-between md:justify-start">
              <h2 className="flex items-center text-2xl font-bold text-indigo-600">
                <Settings2 className="mr-2" /> Settings
              </h2>
              <button className="md:hidden ml-auto" onClick={() => setMenuOpen(false)}>
                <XCircle className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <nav className="mt-8 space-y-4">
              <button
                className={`w-full flex items-center px-4 py-2 rounded-lg hover:bg-indigo-100 transition ${
                  !editing ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600'
                }`}
                onClick={() => { setEditing(false); setMenuOpen(false); }}
              >
                <User2 className="mr-3" /> Profile Overview
              </button>
              <button
                className={`w-full flex items-center px-4 py-2 rounded-lg hover:bg-indigo-100 transition ${
                  editing ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600'
                }`}
                onClick={() => { setEditing(true); setMenuOpen(false); }}
              >
                <Edit2 className="mr-3" /> Edit Profile
              </button>
              <button
                className="w-full flex items-center px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                onClick={handleDelete}
              >
                <Trash2 className="mr-3" /> Delete Account
              </button>
            </nav>
          </div>
        </aside>

        {/* Mobile menu button */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-indigo-600 flex items-center">
            <Settings2 className="mr-2" /> Settings
          </h2>
          <button onClick={() => setMenuOpen(true)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-12">
          <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-10 space-y-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 flex items-center">
              <User2 className="mr-2 text-indigo-600" /> Account Settings
            </h1>

            {msg && (
              <div className="flex items-center bg-green-50 border border-green-400 text-green-800 px-4 py-3 rounded-lg space-x-2">
                <Save className="w-5 h-5" /> <span className="text-sm md:text-base">{msg}</span>
              </div>
            )}
            {error && (
              <div className="flex items-center bg-red-50 border border-red-400 text-red-800 px-4 py-3 rounded-lg space-x-2">
                <XCircle className="w-5 h-5" /> <span className="text-sm md:text-base">{error}</span>
              </div>
            )}

            {/* View Mode */}
            {!editing && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-indigo-50 p-4 md:p-6 rounded-xl space-y-4 sm:space-y-0">
                  <div>
                    <p className="text-gray-600 uppercase text-xs md:text-sm font-semibold">Username</p>
                    <p className="text-gray-800 text-lg md:text-xl font-medium">{form.username}</p>
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-indigo-600 hover:text-indigo-700 flex items-center"
                  >
                    <Edit2 className="mr-1" /> Change
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-indigo-50 p-4 md:p-6 rounded-xl space-y-4 sm:space-y-0">
                  <div>
                    <p className="text-gray-600 uppercase text-xs md:text-sm font-semibold">Email</p>
                    <p className="text-gray-800 text-lg md:text-xl font-medium">{form.email}</p>
                    <p className="text-xs text-gray-500 italic mt-1">Cannot be changed</p>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Mode */}
            {editing && (
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-gray-700 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    value={form.username}
                    onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                    required
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 p-3 md:p-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition disabled:opacity-60 text-sm md:text-base"
                    placeholder="Enter your username"
                    autoComplete="username"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                    Email <span className="text-xs md:text-sm text-gray-500">(cannot be changed)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      disabled
                      className="w-full rounded-lg border border-gray-200 p-3 md:p-4 bg-gray-100 text-gray-600 cursor-not-allowed select-none text-sm md:text-base"
                      autoComplete="email"
                    />
                    <Mail className="absolute top-3 md:top-4 right-3 md:right-4 text-gray-400" />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:flex-1 flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg p-3 md:p-4 transition disabled:opacity-60 text-sm md:text-base"
                  >
                    <Save className="w-4 h-4 md:w-5 md:h-5" /> <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="w-full md:flex-1 flex items-center justify-center space-x-2 border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg p-3 md:p-4 transition disabled:opacity-60 text-sm md:text-base"
                  >
                    <XCircle className="w-4 h-4 md:w-5 md:h-5" /> <span>Cancel</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </>
  );
}