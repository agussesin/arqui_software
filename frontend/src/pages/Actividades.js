import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import './Actividades.css';

function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const token = localStorage.getItem('token');

  const getUserIdFromToken = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id_usuario || payload.user_id;
    } catch (e) {
      return null;
    }
  };

  const id_usuario = getUserIdFromToken();

  useEffect(() => {
    axios.get('/actividades')
      .then((response) => {
        setActividades(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener las actividades:', error);
      });
  }, []);

  const mostrarDetalle = (actividad) => {
    setDetalle(actividad);
    setMensaje('');
  };

  const inscribirse = () => {
    if (!detalle || !id_usuario) return;

    axios.post('/inscripciones', {
      id_usuario: id_usuario,
      id_actividad: detalle.id_actividad
    })
    .then(() => {
      setMensaje('¡Inscripción exitosa!');
    })
    .catch(() => {
      setMensaje('No se pudo realizar la inscripción.');
    });
  };

  return (
    <div className="actividades-container">
      <h1>Actividades Disponibles</h1>
      <ul>
        {actividades.map((actividad) => (
          <li key={actividad.id_actividad} className="actividad-item">
            <h3>{actividad.descripcion}</h3>
            <p><strong>Categoría:</strong> {actividad.categoria}</p>
            <p><strong>Profesor:</strong> {actividad.profesor}</p>
            <button onClick={() => mostrarDetalle(actividad)}>Ver más</button>
          </li>
        ))}
      </ul>

      {detalle && (
        <div className="detalle-actividad">
          <h2>Detalle de la Actividad</h2>
          <p><strong>Descripción:</strong> {detalle.descripcion}</p>
          <p><strong>Profesor:</strong> {detalle.profesor}</p>
          <p><strong>Categoría:</strong> {detalle.categoria}</p>
          <p><strong>Duración:</strong> {detalle.duracion} minutos</p>
          <p><strong>Periodicidad:</strong> {detalle.periodicidad}</p>
          <p><strong>Cupo:</strong> {detalle.cupo}</p>
          <button onClick={inscribirse}>Inscribirme</button>
          {mensaje && <p style={{ color: mensaje.includes('éxito') ? 'lightgreen' : 'red' }}>{mensaje}</p>}
        </div>
      )}
    </div>
  );
}

export default Actividades;
