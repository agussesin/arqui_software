import React, { useState, useEffect } from 'react';
import api from '../services/axios';
import { jwtDecode } from 'jwt-decode';
import './MisActividades.css';

const MisActividades = () => {
  const [actividades, setActividades] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detalle, setDetalle] = useState(null);

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
        const userId = decoded.user_id;

        const response = await api.get(`/mis-actividades/${userId}`);
        setActividades(response.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar tus actividades');
      } finally {
        setLoading(false);
      }
    };

    fetchActividades();
  }, []);

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
          <div className="mis-actividades-grid">
            {Array.isArray(actividades) && actividades.map((actividad) => (
              <div 
                key={actividad.id_inscripcion}
                className="mis-actividad-card"
              >
                <h3>{actividad.actividad?.descripcion || ''}</h3>
                <p><strong>Categoría:</strong> {actividad.actividad?.categoria || ''}</p>
                <p><strong>Profesor:</strong> {actividad.actividad?.profesor || ''}</p>
                <button 
                  onClick={() => setDetalle(actividad)}
                  className="mis-actividad-btn"
                >
                  Ver más
                </button>

                {/* Detalle de la actividad seleccionada */}
                {detalle && detalle.id_inscripcion === actividad.id_inscripcion && (
                  <div className="mis-detalle-actividad">
                    <h4>Detalle de la Actividad</h4>
                    <p><strong>Descripción:</strong> {detalle.actividad?.descripcion}</p>
                    <p><strong>Categoría:</strong> {detalle.actividad?.categoria}</p>
                    <p><strong>Profesor:</strong> {detalle.actividad?.profesor}</p>
                    <p><strong>Duración:</strong> {detalle.actividad?.duracion} minutos</p>
                    <p><strong>Periodicidad:</strong> {detalle.actividad?.periodicidad}</p>
                    <p><strong>Cupo:</strong> {detalle.actividad?.cupo}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisActividades;
  