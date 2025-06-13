import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

/**
 * Componente Navbar
 * 
 * Este componente representa la barra de navegación principal de la aplicación.
 * Maneja la navegación y la autenticación del usuario.
 * Muestra diferentes opciones según el estado de autenticación y el rol del usuario.
 */
export default function Navbar() {
  // Hook para navegación programática (redirecciones)
  const navigate = useNavigate();
  
  // Obtiene el token JWT del localStorage
  // El token se usa para mantener la sesión del usuario
  const token = localStorage.getItem('token');

  /**
   * Función para extraer el rol del usuario del token JWT
   * Decodifica el payload del token y extrae el rol
   * @returns {string|null} El rol del usuario o null si no hay token
   */
  const getRoleFromToken = () => {
    if (!token) return null;
    try {
      // Decodifica el payload del token (segunda parte del JWT)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch (e) {
      return null;
    }
  };

  // Obtiene el rol del usuario actual
  const role = getRoleFromToken();

  /**
   * Función para cerrar sesión
   * Elimina el token y redirige al usuario a la página de login
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="nav">
      <div className="container">
        {/* Link a la página principal - siempre visible */}
        <Link to="/" className="btn">Inicio</Link>

        {/* Renderizado condicional: muestra Login solo si no hay token */}
        {!token && <Link to="/login" className="btn">Login</Link>}

        {/* Renderizado condicional: muestra opciones solo si hay token */}
        {token && (
          <>
            {/* Enlaces a secciones principales */}
            <Link to="/actividades" className="btn">Actividades</Link>
            <Link to="/mis-actividades" className="btn">Mis actividades</Link>
            
            {/* Renderizado condicional: muestra panel admin solo si el rol es Admin */}
            {role === 'Admin' && (
              <Link to="/admin" className="btn">Panel Admin</Link>
            )}
            
            {/* Botón de cerrar sesión */}
            <button onClick={handleLogout} className="btn" style={{ background: 'transparent', border: 'none' }}>
              Cerrar sesión
            </button>
          </>
        )}

        {/* SVG para efectos visuales de la barra de navegación */}
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
            width="800"
            height="60"
            fill="transparent"
            strokeWidth="5"
          ></rect>
        </svg>
      </div>
    </div>
  );
}
