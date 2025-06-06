import React, { useEffect, useState } from 'react';
import axios from '../services/axios';

export default function AdminPanel() {
  const [actividades, setActividades] = useState([]);
  const [form, setForm] = useState({
    descripcion: '',
    categoria: '',
    profesor: '',
    duracion: '',
    periodicidad: '',
    cupo: ''
  });
  const [mensaje, setMensaje] = useState('');

  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  const fetchActividades = () => {
    axios
      .get('/actividades')
      .then((res) => setActividades(res.data))
      .catch(() => setMensaje('Error al cargar actividades'));
  };

  useEffect(() => {
    fetchActividades();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const crearActividad = (e) => {
    e.preventDefault();

    if (!token) {
      setMensaje('Error: usuario no autenticado');
      return;
    }

    const actividad = {
      ...form,
      duracion: parseInt(form.duracion, 10),
      cupo: parseInt(form.cupo, 10),
    };

    axios
      .post('/admin/actividades', actividad, config)
      .then(() => {
        setMensaje('Actividad creada correctamente ✅');
        setForm({
          descripcion: '',
          categoria: '',
          profesor: '',
          duracion: '',
          periodicidad: '',
          cupo: '',
        });
        fetchActividades();
      })
      .catch((error) => {
        console.error('Error al crear actividad:', error.response?.data || error.message);
        setMensaje('Error al crear actividad ❌');
      });
  };

  const eliminarActividad = (id) => {
    if (!token) {
      setMensaje('Error: usuario no autenticado');
      return;
    }

    axios
      .delete(`/admin/actividades/${id}`, config)
      .then(() => {
        setMensaje('Actividad eliminada ✅');
        fetchActividades();
      })
      .catch(() => setMensaje('Error al eliminar ❌'));
  };

  const editarActividad = (act) => {
    const nuevosValores = prompt(`Editar descripción de "${act.descripcion}":`, act.descripcion);
    if (nuevosValores && token) {
      axios
        .put(`/admin/actividades/${act.id_actividad}`, { ...act, descripcion: nuevosValores }, config)
        .then(() => {
          setMensaje('Actividad actualizada ✅');
          fetchActividades();
        })
        .catch(() => setMensaje('Error al editar ❌'));
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#0e0e0e', minHeight: '100vh' }}>
      <h2>Panel de Administración</h2>

      <form onSubmit={crearActividad} style={{ marginBottom: '20px' }}>
        <h4>Crear Nueva Actividad</h4>
        {['descripcion', 'categoria', 'profesor', 'duracion', 'periodicidad', 'cupo'].map((campo) => (
          <input
            key={campo}
            name={campo}
            placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
            value={form[campo]}
            onChange={handleChange}
            required
            style={{
              backgroundColor: '#1f1f1f',
              color: 'white',
              border: '1px solid #555',
              borderRadius: '5px',
              padding: '8px',
              margin: '4px',
              width: '200px'
            }}
          />
        ))}
        <br />
        <button
          type="submit"
          style={{
            backgroundColor: '#ff4c29',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            fontWeight: 'bold',
            marginTop: '10px',
            cursor: 'pointer'
          }}
        >
          Crear
        </button>
      </form>

      {mensaje && <p>{mensaje}</p>}

      <h4>Actividades Existentes</h4>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {actividades.map((act) => (
          <li key={act.id_actividad} style={{ backgroundColor: '#1a1a1a', marginBottom: '10px', padding: '10px', borderRadius: '5px' }}>
            <strong>{act.descripcion}</strong> — {act.categoria} — Prof: {act.profesor}
            <br />
            <button
              onClick={() => editarActividad(act)}
              style={{
                backgroundColor: '#444',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                marginRight: '10px',
                cursor: 'pointer'
              }}
            >
              Editar
            </button>
            <button
              onClick={() => eliminarActividad(act.id_actividad)}
              style={{
                backgroundColor: '#b00020',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
