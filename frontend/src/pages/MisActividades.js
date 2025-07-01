import React, { useState, useEffect } from 'react';
import api from '../services/axios';
import { jwtDecode } from 'jwt-decode';
import ActividadCardVisual from '../components/ActividadCardVisual';
import './MisActividades.css';

const MisActividades = () => {
  const [actividades, setActividades] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
          <>
            {actividades.map((inscripcion) => (
              <ActividadCardVisual
                key={inscripcion.id_inscripcion}
                actividad={inscripcion.actividad}
                showInscripcionButton={false}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default MisActividades;
