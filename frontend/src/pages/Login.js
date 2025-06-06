import React, { useState } from 'react';
import axios from '../services/axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      // Redirigir según rol (opcional más adelante)
      navigate('/');
    } catch (err) {
      setError('Email o contraseña incorrectos');
    }
  };

  return (
    <div className="login-main">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
        {error && <p className="login-error">{error}</p>}
      </form>
    </div>
  );
}