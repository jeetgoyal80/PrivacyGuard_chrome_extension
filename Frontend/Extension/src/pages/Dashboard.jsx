import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [consents, setConsents] = useState([]);
  const [error, setError] = useState('');

  // Fetch all consents on mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/consent/my-consents');
        setConsents(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load consents');
      }
    })();
  }, []);

  // Revoke/edit a consent
  const handleRevoke = async (id) => {
    try {
      await api.put(`/consent/update/${id}`, { consentGiven: false });
      setConsents(c =>
        c.map(item =>
          item._id === id ? { ...item, consentGiven: false } : item
        )
      );
    } catch (err) {
      console.error(err);
      setError('Failed to update consent');
    }
  };

  return (
    <><Navbar/>
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-4xl font-extrabold mb-8 text-gray-900 border-b-2 border-indigo-600 pb-3">
        Your Consent History
      </h2>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {consents.length === 0 ? (
        <p className="text-gray-600 text-lg text-center mt-20">
          No consents logged yet.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {consents.map(c => (
            <div
              key={c._id}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
            >
              <div>
                <h3 className="text-xl font-semibold text-indigo-700 mb-2 truncate">
                  {c.service}
                </h3>
                <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                  <span className="font-medium">Data Shared:</span>{' '}
                  {c.dataShared.join(', ')}
                </p>
                <p className="mb-4">
                  <span className="font-medium">Consent Given: </span>
                  {c.consentGiven ? (
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-green-800 bg-green-200 rounded-full">
                      ✅ Yes
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-red-800 bg-red-200 rounded-full">
                      ❌ No
                    </span>
                  )}
                </p>
              </div>

              {c.consentGiven && (
                <button
                  onClick={() => handleRevoke(c._id)}
                  className="mt-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition"
                  aria-label={`Revoke consent for ${c.service}`}
                >
                  Revoke Consent
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}
