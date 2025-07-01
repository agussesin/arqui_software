import React, { useState } from 'react';
import axios from '../services/axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

/**
 * Componente Signup
 * 
 * Esta página maneja el registro de nuevos usuarios:
 * 1. Proporciona un formulario de registro completo
 * 2. Valida los campos obligatorios
 * 3. Verifica que las contraseñas coincidan
 * 4. Realiza la petición de registro al backend
 * 5. Maneja errores y éxito del registro
 * 6. Redirige al login después del registro exitoso
 */
export default function Signup() {
  // Estados para manejar el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    dni: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Hook para navegación programática
  const navigate = useNavigate();

  /**
   * Maneja los cambios en los campos del formulario
   * @param {Event} e - Evento del input
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Valida el formulario antes del envío
   * @returns {string|null} - Mensaje de error o null si es válido
   */
  const validateForm = () => {
    // Validar campos obligatorios
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.password) {
      return 'Por favor, completa todos los campos obligatorios';
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Por favor, ingresa un email válido';
    }

    // Validar longitud de contraseña
    if (formData.password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      return 'Las contraseñas no coinciden';
    }

    return null;
  };

  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validar formulario
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // Preparar datos para enviar (sin confirmPassword)
      const { confirmPassword, ...userData } = formData;
      
      // Realizar la petición de registro
      const response = await axios.post('/usuarios', userData);
      
      // Mostrar mensaje de éxito
      setSuccess(true);
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      // Manejar errores del servidor
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Error al crear la cuenta. Por favor, intenta nuevamente.');
      }
    }
  };

  // Si el registro fue exitoso, mostrar mensaje de éxito
  if (success) {
    return (
      <div className="signup-main">
        <div className="signup-success">
          <h2>¡Cuenta creada exitosamente!</h2>
          <p>Serás redirigido al login en unos segundos...</p>
          <button 
            className="cta-btn"
            onClick={() => navigate('/login')}
          >
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-main">
      <h2>Crear cuenta</h2>
      <p className="signup-subtitle">Únete a THE GYM y comienza tu transformación</p>
      
      {/* Formulario de registro */}
      <form onSubmit={handleSubmit} className="signup-form">
        
        {/* Fila de nombre y apellido */}
        <div className="form-row">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre *"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido *"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
        </div>

        {/* Campo de email */}
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico *"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Fila de DNI y teléfono */}
        <div className="form-row">
          <input
            type="text"
            name="dni"
            placeholder="DNI"
            value={formData.dni}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={handleChange}
          />
        </div>

        {/* Campo de contraseña */}
        <input
          type="password"
          name="password"
          placeholder="Contraseña *"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* Campo de confirmar contraseña */}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar contraseña *"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {/* Botón de envío */}
        <button type="submit">Crear cuenta</button>

        {/* Mensaje de error si existe */}
        {error && <p className="signup-error">{error}</p>}
      </form>

      {/* Link para ir al login */}
      <div className="signup-footer">
        <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a></p>
      </div>
    </div>
  );
} 