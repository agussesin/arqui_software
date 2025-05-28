import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../services/axios';

function ActividadDetalle() {
  const { id } = useParams();
  const [actividad, setActividad] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const id_usuario = localStorage.getItem('id_usuario'); // Asegurate de guardar esto al logearte

  useEffect(() => {
    axios.get(`/actividades/${id}`)
      .then((res) => setActividad(res.data))
      .catch(() => setMensaje('Error al cargar la actividad'));
  }, [id]);

  const inscribirse = () => {
    axios.post('/inscripciones', {
      id_usuario: Number(id_usuario),
      id_actividad: Number(id)
    })
    .then(() => setMensaje('Inscripción exitosa ✅'))
    .catch(() => setMensaje('Ya estás inscripto ❌'));
  };

  if (!actividad) return <p>Cargando actividad...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>{actividad.descripcion}</h2>
      <p><strong>Profesor:</strong> {actividad.profesor}</p>
      <p><strong>Categoría:</strong> {actividad.categoria}</p>
      <p><strong>Día:</strong> {actividad.dia}</p>
      <p><strong>Horario:</strong> {actividad.horario}</p>
      <p><strong>Cupo:</strong> {actividad.cupo}</p>
      <p><strong>Duración:</strong> {actividad.duracion} minutos</p>

      <button onClick={inscribirse}>Inscribirme</button>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default ActividadDetalle;
