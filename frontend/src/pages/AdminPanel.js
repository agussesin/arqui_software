import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import './AdminPanel.css'; // Asegurate de importar el archivo CSS

/**
 * Componente AdminPanel
 * 
 * Panel de administración que permite:
 * 1. Ver todas las actividades
 * 2. Crear nuevas actividades
 * 3. Gestionar actividades existentes
 * Solo accesible para usuarios con rol Admin
 */
export default function AdminPanel() {
  // Estado para almacenar la lista de actividades
  const [actividades, setActividades] = useState([]);
  
  // Estado para el formulario de nueva actividad
  const [form, setForm] = useState({
    descripcion: '',
    categoria: '',
    profesor: '',
    duracion: '',
    periodicidad: '',
    cupo: ''
  });
  
  // Estado para mensajes de feedback
  const [mensaje, setMensaje] = useState('');

  // Configuración de headers para peticiones autenticadas
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  /**
   * Función para obtener todas las actividades
   * Se ejecuta al montar el componente y después de crear una nueva actividad
   */
  const fetchActividades = () => {
    axios
      .get('/actividades')
      .then((res) => setActividades(res.data))
      .catch(() => setMensaje('Error al cargar actividades'));
  };

  // Efecto para cargar actividades al montar el componente
  useEffect(() => {
    fetchActividades();
  }, []);

  /**
   * Maneja los cambios en los campos del formulario
   * @param {Event} e - Evento del input
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Maneja la creación de una nueva actividad
   * @param {Event} e - Evento del formulario
   */
  const crearActividad = (e) => {
    e.preventDefault();

    // Verifica autenticación
    if (!token) {
      setMensaje('Error: usuario no autenticado');
      return;
    }

    // Prepara los datos de la actividad
    const actividad = {
      ...form,
      duracion: parseInt(form.duracion, 10),
      cupo: parseInt(form.cupo, 10),
    };

    // Envía la petición para crear la actividad
    axios
      .post('/admin/actividades', actividad, config)
      .then(() => {
        setMensaje('Actividad creada correctamente ✅');
        // Limpia el formulario
        setForm({
          descripcion: '',
          categoria: '',
          profesor: '',
          duracion: '',
          periodicidad: '',
          cupo: '',
        });
        // Recarga la lista de actividades
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
    <div className="admin-container">
      <h2>Panel de Administración</h2>

      <form onSubmit={crearActividad} className="admin-form">
        <h4>Crear Nueva Actividad</h4>
        {['descripcion', 'categoria', 'profesor', 'duracion', 'periodicidad', 'cupo'].map((campo) => (
          <input
            key={campo}
            name={campo}
            placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
            value={form[campo]}
            onChange={handleChange}
            required
            className="admin-input"
          />
        ))}
        <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' }}>Crear</button>
      </form>

      {mensaje && <p>{mensaje}</p>}

      <h4>Actividades Existentes</h4>
      <ul className="admin-actividad-list">
        {actividades.map((act) => (
          <li key={act.id_actividad} className="admin-actividad-item">
            <strong>{act.descripcion}</strong> — {act.categoria} — Prof: {act.profesor}
            <br />
            <button onClick={() => editarActividad(act)} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', marginRight: '10px', cursor: 'pointer' }}>Editar</button>
            <button onClick={() => eliminarActividad(act.id_actividad)} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
