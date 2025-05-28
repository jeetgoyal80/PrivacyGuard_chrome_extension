import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Axios instance with auth header
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [consents, setConsents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/consent/my-consents');
        setConsents(data);
      } catch (err) {
        console.error('Failed fetching consents:', err);
        setError(err.response?.data?.error || 'Failed to load consents');
      }
    })();
  }, []);

  const renderPermissions = (consent) => (
    consent.dataShared.map(({ permission, granted }) => (
      <div key={permission} className="flex justify-between items-center mb-1">
        <p className="text-gray-700 text-sm">
          <span className="font-medium">{permission}:</span>{' '}
          {granted ? '✅ Granted' : '❌ Denied'}
        </p>
      </div>
    ))
  );

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-extrabold mb-8 text-gray-900 border-b-2 border-indigo-600 pb-3">
          Permission Dashboard
        </h2>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        )}

        {consents.length === 0 ? (
          <p className="text-gray-600 text-lg text-center mt-20">
            No consents logged yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {consents.map(consent => (
              <div
                key={consent._id}
                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div>
                  <h3 className="text-xl font-semibold text-indigo-700 mb-4 truncate">
                    {consent.service}
                  </h3>

                  {renderPermissions(consent)}

                  <button
                    onClick={() => window.open(consent.service, '_blank')}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                  >
                    Go to Website
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
