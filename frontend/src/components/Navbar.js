import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // Decodifica el token para ver el rol (muy simple y sin validar firma)
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
    <nav style={{ marginBottom: '20px' }}>
    <h3>🔧 DEBUG: Navbar cargado</h3>
      <Link to="/">Inicio</Link> {' | '}
      {!token && <Link to="/login">Login</Link>}
      {token && (
        <>
          {' | '}<Link to="/mis-actividades">Mis actividades</Link>
          {role === 'Admin' && (
            <>
              {' | '}<Link to="/admin">Panel Admin</Link>
            </>
          )}
          {' | '}<button onClick={handleLogout}>Cerrar sesión</button>
        </>
      )}
    </nav>
  );
}
