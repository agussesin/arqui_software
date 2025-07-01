import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import { jwtDecode } from 'jwt-decode';
import ActividadCardVisual from '../components/ActividadCardVisual';
import './Actividades.css';

function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [actividadesFiltradas, setActividadesFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
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

  // Función para filtrar actividades
  const filtrarActividades = (actividades, terminoBusqueda) => {
    if (!terminoBusqueda.trim()) {
      return actividades;
    }

    const termino = terminoBusqueda.toLowerCase().trim();
    return actividades.filter((actividad) => {
      return (
        actividad.descripcion?.toLowerCase().includes(termino) ||
        actividad.categoria?.toLowerCase().includes(termino) ||
        actividad.periodicidad?.toLowerCase().includes(termino)
      );
    });
  };

  // Manejar cambios en la búsqueda
  const handleBusquedaChange = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    const actividadesFilt = filtrarActividades(actividades, valor);
    setActividadesFiltradas(actividadesFilt);
  };

  // Manejar Enter en la búsqueda
  const handleBusquedaKeyPress = (e) => {
    if (e.key === 'Enter') {
      const actividadesFilt = filtrarActividades(actividades, busqueda);
      setActividadesFiltradas(actividadesFilt);
    }
  };

  useEffect(() => {
    axios.get('/actividades')
      .then((response) => {
        setActividades(response.data);
        setActividadesFiltradas(response.data); // Inicializar las filtradas
      })
      .catch((error) => console.error('Error al obtener las actividades:', error));
  }, []);

  // Actualizar filtradas cuando cambian las actividades
  useEffect(() => {
    const actividadesFilt = filtrarActividades(actividades, busqueda);
    setActividadesFiltradas(actividadesFilt);
  }, [actividades, busqueda]);

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

        {/* Barra de búsqueda */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <svg 
              className="search-icon" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por descripción, categoría o periodicidad..."
              value={busqueda}
              onChange={handleBusquedaChange}
              onKeyPress={handleBusquedaKeyPress}
            />
            {busqueda && (
              <button 
                className="clear-search" 
                onClick={() => {
                  setBusqueda('');
                  setActividadesFiltradas(actividades);
                }}
              >
                ×
              </button>
            )}
          </div>
          <div className="search-results-count">
            {actividadesFiltradas.length} actividad{actividadesFiltradas.length !== 1 ? 'es' : ''} encontrada{actividadesFiltradas.length !== 1 ? 's' : ''}
          </div>
        </div>

        {actividadesFiltradas.map((actividad) => (
          <ActividadCardVisual
            key={actividad.id_actividad}
            actividad={actividad}
            id_usuario={id_usuario}
            usuarioYaInscripto={estaInscripto(actividad.id_actividad)}
            showInscripcionButton={true}
          />
        ))}

        {actividadesFiltradas.length === 0 && busqueda && (
          <div className="no-results">
            <p>No se encontraron actividades que coincidan con "{busqueda}"</p>
            <button 
              className="clear-search-btn"
              onClick={() => {
                setBusqueda('');
                setActividadesFiltradas(actividades);
              }}
            >
              Limpiar búsqueda
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Actividades;
