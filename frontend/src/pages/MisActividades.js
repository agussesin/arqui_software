import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../services/axios';

function MisActividades() {
  const [actividades, setActividades] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const token = localStorage.getItem('token');

  const getUserIdFromToken = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id_usuario;
    } catch (e) {
      return null;
    }
  };

  const id_usuario = getUserIdFromToken();

  useEffect(() => {
    if (!id_usuario) {
      setMensaje('Usuario no autenticado');
      return;
    }

    axios.get(`/mis-actividades/${id_usuario}`)
      .then((res) => {
        setActividades(res.data);
        if (res.data.length === 0) setMensaje('No estás inscripto en ninguna actividad todavía.');
      })
      .catch(() => setMensaje('Error al cargar tus actividades'));
  }, [id_usuario]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Mis Actividades</h2>
      {mensaje && <p>{mensaje}</p>}
      <ul>
        {actividades.map((act) => (
          <li key={act.id_actividad}>
            <strong>{act.descripcion}</strong> — Categoría: {act.categoria} — Profesor: {act.profesor}
            {' '}<Link to={`/actividades/${act.id_actividad}`}><button>Ver más</button></Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MisActividades;
