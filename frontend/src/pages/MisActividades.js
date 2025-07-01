import React, { useState, useEffect } from 'react';
import api from '../services/axios';
import { jwtDecode } from 'jwt-decode';
import ActividadCardVisual from '../components/ActividadCardVisual';
import './MisActividades.css';

const MisActividades = () => {
  const [actividades, setActividades] = useState([]);
  const [actividadesFiltradas, setActividadesFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para filtrar actividades
  const filtrarActividades = (inscripciones, terminoBusqueda) => {
    if (!terminoBusqueda.trim()) {
      return inscripciones;
    }

    const termino = terminoBusqueda.toLowerCase().trim();
    return inscripciones.filter((inscripcion) => {
      const actividad = inscripcion.actividad;
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
    const fetchActividades = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No hay sesión activa');
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded.user_id || decoded.id_usuario;

        const response = await api.get(`/mis-actividades/${userId}`);
        setActividades(response.data);
        setActividadesFiltradas(response.data); // Inicializar las filtradas
        setError(null);
      } catch (err) {
        setError('Error al cargar tus actividades');
      } finally {
        setLoading(false);
      }
    };

    fetchActividades();
  }, []);

  // Actualizar filtradas cuando cambian las actividades
  useEffect(() => {
    const actividadesFilt = filtrarActividades(actividades, busqueda);
    setActividadesFiltradas(actividadesFilt);
  }, [actividades, busqueda]);

  if (loading) {
    return (
      <div className="mis-actividades-bg">
        <div className="mis-actividades-main">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mis-actividades-bg">
        <div className="mis-actividades-main">{error}</div>
      </div>
    );
  }

  return (
    <div className="mis-actividades-bg">
      <div className="mis-actividades-main">
        <h1>Mis Actividades</h1>

        {Array.isArray(actividades) && actividades.length === 0 ? (
          <p>No estás inscripto en ninguna actividad todavía</p>
        ) : (
          <>
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

            {actividadesFiltradas.map((inscripcion) => (
              <ActividadCardVisual
                key={inscripcion.id_inscripcion}
                actividad={inscripcion.actividad}
                showInscripcionButton={false}
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
          </>
        )}
      </div>
    </div>
  );
};

export default MisActividades;
