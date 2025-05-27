import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import Navbar from '../components/Navbar';

export default function Home() {
  const [actividades, setActividades] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const response = await axios.get('/actividades');
        setActividades(response.data);
      } catch (err) {
        setError('Error al cargar actividades');
      }
    };

    fetchActividades();
  }, []);

  return (
    <div>
      <Navbar />
      <h2>Actividades Disponibles</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {actividades.map((actividad) => (
          <li key={actividad.id_actividad}>
            <strong>{actividad.descripcion}</strong> — Categoría: {actividad.categoria} — Profesor: {actividad.profesor}
          </li>
        ))}
      </ul>
    </div>
  );
}
