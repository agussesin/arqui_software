import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import { jwtDecode } from 'jwt-decode';
import ActividadCardVisual from '../components/ActividadCardVisual';
import './Actividades.css';

function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [inscripciones, setInscripciones] = useState([]);
  const [loadingInscripciones, setLoadingInscripciones] = useState(true);
  const [cuposRestantes, setCuposRestantes] = useState(null);

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
      .then((response) => setActividades(response.data))
      .catch((error) => console.error('Error al obtener las actividades:', error));
  }, []);

  useEffect(() => {
    if (!id_usuario) return;
    setLoadingInscripciones(true);
    axios.get(`/mis-actividades/${id_usuario}`)
      .then((response) => setInscripciones(response.data))
      .catch((error) => {
        setInscripciones([]);
        console.error('Error al obtener inscripciones:', error);
      })
      .finally(() => setLoadingInscripciones(false));
  }, [id_usuario]);

  useEffect(() => {
    if (detalle) {
      setCuposRestantes(detalle.cupo - (detalle.inscriptos || 0));
    } else {
      setCuposRestantes(null);
    }
  }, [detalle]);

  const estaInscripto = (id_actividad) => {
    if (!Array.isArray(inscripciones)) return false;
    return inscripciones.some(insc => insc.id_actividad === id_actividad);
  };

  const inscribirse = async () => {
    if (!detalle || !id_usuario) return;
    try {
      await axios.post('/inscripciones', {
        id_usuario: id_usuario,
        id_actividad: detalle.id_actividad
      });
      setMensaje('¡Inscripción exitosa!');
      setCuposRestantes((prev) => (prev !== null ? prev - 1 : prev));
      const resp = await axios.get(`/mis-actividades/${id_usuario}`);
      setInscripciones(resp.data);
    } catch {
      setMensaje('No se pudo realizar la inscripción.');
    }
  };

  const handleDesinscribirse = async () => {
    if (!detalle || !id_usuario) return;
    try {
      await axios.delete(`/inscripciones/${id_usuario}/${detalle.id_actividad}`);
      setMensaje('Te desinscribiste correctamente.');
      setCuposRestantes((prev) => (prev !== null ? prev + 1 : prev));
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

        {actividades.map((actividad) => (
          <ActividadCardVisual
            key={actividad.id_actividad}
            actividad={actividad}
            id_usuario={id_usuario}
            usuarioYaInscripto={estaInscripto(actividad.id_actividad)}
            showInscripcionButton={true}
          />
        ))}
      </div>
    </div>
  );
}

export default Actividades;
