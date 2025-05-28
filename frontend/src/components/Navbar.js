import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const getRoleFromToken = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch (e) {
      return null;
    }
  };

  const role = getRoleFromToken();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="nav">
      <div className="container">
        <Link to="/" className="btn">Inicio</Link>

        {!token && <Link to="/login" className="btn">Login</Link>}

        {token && (
          <>
            <Link to="/mis-actividades" className="btn">Mis actividades</Link>
            {role === 'Admin' && (
              <Link to="/admin" className="btn">Panel Admin</Link>
            )}
            <button onClick={handleLogout} className="btn" style={{ background: 'transparent', border: 'none' }}>
              Cerrar sesión
            </button>
          </>
        )}

        <svg
          className="outline"
          overflow="visible"
          width="400"
          height="60"
          viewBox="0 0 400 60"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            className="rect"
            pathLength="100"
            x="0"
            y="0"
            width="400"
            height="60"
            fill="transparent"
            strokeWidth="5"
          ></rect>
        </svg>
      </div>
    </div>
  );
}
