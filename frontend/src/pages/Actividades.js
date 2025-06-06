import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import { jwtDecode } from 'jwt-decode';
import './Actividades.css';

function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [inscripciones, setInscripciones] = useState([]);
  const [loadingInscripciones, setLoadingInscripciones] = useState(true);

  const token = localStorage.getItem('token');

  const getUserIdFromToken = () => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.user_id || decoded.id_usuario;
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

  useEffect(() => {
    if (!id_usuario) return;
    setLoadingInscripciones(true);
    axios.get(`/mis-actividades/${id_usuario}`)
      .then((response) => {
        setInscripciones(response.data);
      })
      .catch((error) => {
        setInscripciones([]);
        console.error('Error al obtener inscripciones:', error);
      })
      .finally(() => setLoadingInscripciones(false));
  }, [id_usuario]);

  const mostrarDetalle = (actividad) => {
    setDetalle(actividad);
    setMensaje('');
  };

  const estaInscripto = (id_actividad) => {
    if (!Array.isArray(inscripciones)) return false;
    return inscripciones.some(
      (insc) => insc.id_actividad === id_actividad
    );
  };

  const inscribirse = async () => {
    if (!detalle || !id_usuario) return;
    try {
      await axios.post('/inscripciones', {
        id_usuario: id_usuario,
        id_actividad: detalle.id_actividad
      });
      setMensaje('¡Inscripción exitosa!');
      const resp = await axios.get(`/mis-actividades/${id_usuario}`);
      setInscripciones(resp.data);
    } catch {
      setMensaje('No se pudo realizar la inscripción.');
    }
  };

  const desinscribirse = async () => {
    if (!detalle || !id_usuario) return;
    try {
      await axios.delete(`/inscripciones/${id_usuario}/${detalle.id_actividad}`);
      setMensaje('Te desinscribiste correctamente.');
      const resp = await axios.get(`/mis-actividades/${id_usuario}`);
      setInscripciones(resp.data);
    } catch {
      setMensaje('No se pudo desinscribir.');
    }
  };

  return (
    <div className="actividades-bg">
      <div className="actividades-main">
        <h1>Actividades Disponibles</h1>
        <div className="actividades-grid">
          {actividades.map((actividad) => (
            <div key={actividad.id_actividad} className="actividad-card">
              <h3>{actividad.descripcion}</h3>
              <p><strong>Categoría:</strong> {actividad.categoria}</p>
              <p><strong>Profesor:</strong> {actividad.profesor}</p>
              <button
                onClick={() => mostrarDetalle(actividad)}
                className="actividad-btn"
              >
                Ver más
              </button>
            </div>
          ))}
        </div>

        {detalle && (
          <div className="detalle-actividad">
            <h2>Detalle de la Actividad</h2>
            <p><strong>Descripción:</strong> {detalle.descripcion}</p>
            <p><strong>Profesor:</strong> {detalle.profesor}</p>
            <p><strong>Categoría:</strong> {detalle.categoria}</p>
            <p><strong>Duración:</strong> {detalle.duracion} minutos</p>
            <p><strong>Periodicidad:</strong> {detalle.periodicidad}</p>
            <p><strong>Cupo:</strong> {detalle.cupo}</p>
            {!loadingInscripciones && (
              estaInscripto(detalle.id_actividad) ? (
                <button onClick={desinscribirse} className="actividad-btn">Desinscribirme</button>
              ) : (
                <button onClick={inscribirse} className="actividad-btn">Inscribirme</button>
              )
            )}
            {mensaje && <p className="mensaje" style={{ color: mensaje.includes('éxito') || mensaje.includes('correctamente') ? 'lightgreen' : 'red' }}>{mensaje}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Actividades;
