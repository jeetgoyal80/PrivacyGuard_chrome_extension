import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Settings from './pages/Settings';

const App = () => {
  const approuter = createBrowserRouter([
    {
      path: '/',
      element: <Home/>,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/dashboard',
      element: (
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      ),
    },
    {
      path: '/settings',
      element: (
        <PrivateRoute>
          <Settings />
        </PrivateRoute>
      ),
    },
  ]);

  return <RouterProvider router={approuter} />;
};

export default App;
