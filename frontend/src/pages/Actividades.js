import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import { jwtDecode } from 'jwt-decode';
// import './Actividades.css'; // Dejar de usar el CSS viejo

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
    <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', padding: '20px' }}>
      <h1>Actividades Disponibles</h1>
      <div style={{ display: 'grid', gap: '20px' }}>
        {actividades.map((actividad) => (
          <div key={actividad.id_actividad} style={{
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#111',
            marginBottom: '10px'
          }}>
            <h3>{actividad.descripcion}</h3>
            <p><strong>Categoría:</strong> {actividad.categoria}</p>
            <p><strong>Profesor:</strong> {actividad.profesor}</p>
            <button
              onClick={() => mostrarDetalle(actividad)}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Ver más
            </button>
          </div>
        ))}
      </div>

      {detalle && (
        <div style={{
          marginTop: '30px',
          background: '#222',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          <h2 style={{ textAlign: 'center' }}>Detalle de la Actividad</h2>
          <p><strong>Descripción:</strong> {detalle.descripcion}</p>
          <p><strong>Profesor:</strong> {detalle.profesor}</p>
          <p><strong>Categoría:</strong> {detalle.categoria}</p>
          <p><strong>Duración:</strong> {detalle.duracion} minutos</p>
          <p><strong>Periodicidad:</strong> {detalle.periodicidad}</p>
          <p><strong>Cupo:</strong> {detalle.cupo}</p>
          {!loadingInscripciones && (
            estaInscripto(detalle.id_actividad) ? (
              <button onClick={desinscribirse} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>Desinscribirme</button>
            ) : (
              <button onClick={inscribirse} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>Inscribirme</button>
            )
          )}
          {mensaje && <p style={{ color: mensaje.includes('éxito') || mensaje.includes('correctamente') ? 'lightgreen' : 'red', marginTop: '10px' }}>{mensaje}</p>}
        </div>
      )}
    </div>
  );
}

export default Actividades;
