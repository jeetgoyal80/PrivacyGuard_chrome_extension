// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // render the wrapped component(s)
  return children;
}
