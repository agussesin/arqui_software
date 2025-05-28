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

  const fetchActividades = () => {
    axios.get('/actividades')
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
    axios.post('/admin/actividades', form)
      .then(() => {
        setMensaje('Actividad creada correctamente ✅');
        setForm({ descripcion: '', categoria: '', profesor: '', duracion: '', periodicidad: '', cupo: '' });
        fetchActividades();
      })
      .catch(() => setMensaje('Error al crear actividad ❌'));
  };

  const eliminarActividad = (id) => {
    axios.delete(`/admin/actividades/${id}`)
      .then(() => {
        setMensaje('Actividad eliminada ✅');
        fetchActividades();
      })
      .catch(() => setMensaje('Error al eliminar ❌'));
  };

  const editarActividad = (act) => {
    const nuevosValores = prompt(`Editar descripción de "${act.descripcion}":`, act.descripcion);
    if (nuevosValores) {
      axios.put(`/admin/actividades/${act.id_actividad}`, { ...act, descripcion: nuevosValores })
        .then(() => {
          setMensaje('Actividad actualizada ✅');
          fetchActividades();
        })
        .catch(() => setMensaje('Error al editar ❌'));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Panel de Administración</h2>

      <form onSubmit={crearActividad} style={{ marginBottom: '20px' }}>
        <h4>Crear Nueva Actividad</h4>
        <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} required />
        <input name="categoria" placeholder="Categoría" value={form.categoria} onChange={handleChange} required />
        <input name="profesor" placeholder="Profesor" value={form.profesor} onChange={handleChange} required />
        <input name="duracion" placeholder="Duración" value={form.duracion} onChange={handleChange} required />
        <input name="periodicidad" placeholder="Periodicidad" value={form.periodicidad} onChange={handleChange} required />
        <input name="cupo" placeholder="Cupo" value={form.cupo} onChange={handleChange} required />
        <button type="submit">Crear</button>
      </form>

      {mensaje && <p>{mensaje}</p>}

      <h4>Actividades Existentes</h4>
      <ul>
        {actividades.map((act) => (
          <li key={act.id_actividad}>
            <strong>{act.descripcion}</strong> — {act.categoria} — Prof: {act.profesor}
            {' '}
            <button onClick={() => editarActividad(act)}>Editar</button>
            <button onClick={() => eliminarActividad(act.id_actividad)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
