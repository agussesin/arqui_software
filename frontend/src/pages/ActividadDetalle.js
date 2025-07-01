import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../services/axios';
import './ActividadDetalle.css';
import BotonInscripcion from '../components/BotonInscripcion';

function ActividadDetalle() {
  const { id } = useParams();
  const [actividad, setActividad] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [inscripto, setInscripto] = useState(false);
  const id_usuario = localStorage.getItem('id_usuario');

  useEffect(() => {
    axios.get(`/actividades/${id}`)
      .then((res) => {
        setActividad(res.data);
        // Suponiendo que el backend retorna un array de inscriptos o un campo inscripto para el usuario actual
        setInscripto(res.data.inscripto || (res.data.inscriptosUsuarios?.includes(Number(id_usuario))));
      })
      .catch(() => setMensaje('Error al cargar la actividad'));
  }, [id, id_usuario]);

  const inscribirse = () => {
    axios.post('/inscripciones', {
      id_usuario: Number(id_usuario),
      id_actividad: Number(id)
    })
      .then(() => setMensaje('Inscripción exitosa ✅'))
      .catch(() => setMensaje('Ya estás inscripto ❌'));
  };

  if (!actividad) return <p className="actividad-detalle-loading">Cargando actividad...</p>;

  // Opcional: imagen por categoría
  const imagenPorCategoria = {
    'fuerza': '/images/ride.jpg',
    'resistencia': '/images/cross.jpg',
    'zen': '/images/yoga.jpg',
  };
  const imagen = imagenPorCategoria[actividad.categoria?.toLowerCase()] || '/images/default.jpg';

  return (
    <div className="actividad-detalle-bg">
      <div className="actividad-detalle-card">
        <img src={imagen} alt={actividad.descripcion} className="actividad-detalle-imagen" />
        <div className="actividad-detalle-contenido">
          <h2>{actividad.descripcion}</h2>
          <p><strong>Profesor:</strong> {actividad.profesor}</p>
          <p><strong>Categoría:</strong> {actividad.categoria}</p>
          <p><strong>Día:</strong> {actividad.dia}</p>
          <p><strong>Horario:</strong> {actividad.horario}</p>
          <p><strong>Cupo:</strong> {actividad.cupo}</p>
          <p><strong>Duración:</strong> {actividad.duracion} minutos</p>

          <BotonInscripcion
            actividad={{
              id: actividad.id || actividad.id_actividad,
              cupoMaximo: actividad.cupo,
              inscriptos: actividad.inscriptos || actividad.cantidad_inscriptos || 0
            }}
            inscripto={inscripto}
            onCambioInscripcion={(nuevoEstado, nuevosInscriptos) => {
              setInscripto(nuevoEstado);
              setActividad((prev) => ({ ...prev, inscriptos: nuevosInscriptos }));
              setMensaje(nuevoEstado ? 'Inscripción exitosa ✅' : 'Desinscripción exitosa ✅');
            }}
          />
          {mensaje && <p className="actividad-detalle-msg">{mensaje}</p>}
        </div>
      </div>
    </div>
  );
}

export default ActividadDetalle;
