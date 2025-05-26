import React from 'react';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <><Navbar/>
    
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-extrabold mb-4">
          Welcome to Extension Project
        </h1>
        <p className="text-xl max-w-3xl mx-auto mb-8">
          Empower your workflow with our cutting-edge extension. Simple, powerful, and tailored for your success.
        </p>
        <a
          href="/signup"
          className="inline-block bg-white text-blue-700 font-semibold px-8 py-3 rounded-md shadow-md hover:bg-gray-100 transition"
        >
          Get Started
        </a>
      </section>

      {/* Features Section */}
      <section className="flex-grow bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3 text-blue-700">Seamless Integration</h3>
            <p className="text-gray-600">
              Easily integrate with your existing tools and platforms to streamline your workflow.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3 text-blue-700">Real-time Analytics</h3>
            <p className="text-gray-600">
              Track your progress with powerful analytics dashboards and insights.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3 text-blue-700">Customizable Settings</h3>
            <p className="text-gray-600">
              Tailor the extension’s functionality to suit your unique needs and preferences.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6 text-center">
        &copy; {new Date().getFullYear()} Extension Project. All rights reserved.
      </footer>
    </div>
    </>
  );
};

export default Home;
