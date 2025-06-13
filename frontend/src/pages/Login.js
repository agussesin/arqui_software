import React, { useState } from 'react';
import axios from '../services/axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Login.css';

/**
 * Componente Login
 * 
 * Esta página maneja la autenticación de usuarios:
 * 1. Proporciona un formulario de inicio de sesión
 * 2. Maneja el estado del formulario
 * 3. Realiza la petición de autenticación
 * 4. Almacena el token JWT en localStorage
 * 5. Redirige al usuario después del login exitoso
 */
export default function Login() {
  // Estados para manejar el formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  // Hook para navegación programática
  const navigate = useNavigate();

  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Realiza la petición de login
      const response = await axios.post('/login', { email, password });
      const token = response.data.token;
      
      // Almacena el token en localStorage
      localStorage.setItem('token', token);
      
      // Redirige al usuario a la página principal
      navigate('/');
    } catch (err) {
      // Maneja errores de autenticación
      setError('Email o contraseña incorrectos');
    }
  };

  return (
    <div className="login-main">
      <h2>Iniciar sesión</h2>
      {/* Formulario de login */}
      <form onSubmit={handleSubmit} className="login-form">
        {/* Campo de email */}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {/* Campo de contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {/* Botón de envío */}
        <button type="submit">Ingresar</button>
        {/* Mensaje de error si existe */}
        {error && <p className="login-error">{error}</p>}
      </form>
    </div>
  );
}