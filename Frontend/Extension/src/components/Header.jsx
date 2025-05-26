// src/components/Header.jsx
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const auth = !!localStorage.getItem('token');
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="flex justify-between p-4 bg-gray-100 mb-4">
      <h1 className="text-xl font-bold">DataGate</h1>
      <nav>
        {auth ? (
          <>
            <Link className="mr-4" to="/dashboard">Dashboard</Link>
            <Link className="mr-4" to="/settings">Settings</Link>
            <button onClick={logout} className="text-red-500">Logout</button>
          </>
        ) : (
          <>
            <Link className="mr-4" to="/">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
