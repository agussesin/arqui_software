import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import './AdminPanel.css'; // Asegurate de importar el archivo CSS
import EditarActividadModal from '../components/EditarActividadModal';

/**
 * Componente AdminPanel
 * 
 * Panel de administración que permite:
 * 1. Ver todas las actividades
 * 2. Crear nuevas actividades con imágenes
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

  // Estados para manejo de imágenes
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState(null);
  const [cargandoImagen, setCargandoImagen] = useState(false);

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

  const [modalAbierto, setModalAbierto] = useState(false);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);

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
   * Maneja la selección de imagen
   * @param {Event} e - Evento del input file
   */
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setImagenSeleccionada(null);
      setVistaPrevia(null);
      return;
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setMensaje('❌ Tipo de archivo no válido. Use JPG, PNG o GIF.');
      e.target.value = '';
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMensaje('❌ La imagen debe ser menor a 5MB.');
      e.target.value = '';
      return;
    }

    setImagenSeleccionada(file);

    // Crear vista previa
    const reader = new FileReader();
    reader.onload = (e) => {
      setVistaPrevia(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Limpiar formulario y estados
   */
  const limpiarFormulario = () => {
    setForm({
      descripcion: '',
      categoria: '',
      profesor: '',
      duracion: '',
      periodicidad: '',
      cupo: '',
    });
    setImagenSeleccionada(null);
    setVistaPrevia(null);
    setCargandoImagen(false);
  };

  /**
   * Maneja la creación de una nueva actividad con imagen
   * @param {Event} e - Evento del formulario
   */
  const crearActividad = async (e) => {
    e.preventDefault();

    // Verifica autenticación
    if (!token) {
      setMensaje('❌ Error: usuario no autenticado');
      return;
    }

    // Validar que se haya seleccionado una imagen
    if (!imagenSeleccionada) {
      setMensaje('❌ Debe seleccionar una imagen para la actividad');
      return;
    }

    setCargandoImagen(true);
    setMensaje('⏳ Creando actividad...');

    try {
      // Crear FormData para enviar archivo
      const formData = new FormData();
      formData.append('descripcion', form.descripcion);
      formData.append('categoria', form.categoria);
      formData.append('profesor', form.profesor);
      formData.append('duracion', form.duracion);
      formData.append('periodicidad', form.periodicidad);
      formData.append('cupo', form.cupo);
      formData.append('imagen', imagenSeleccionada);

      // Configuración especial para multipart/form-data
      const configMultipart = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      // Envía la petición para crear la actividad con imagen
      const response = await axios.post('/admin/actividades-con-imagen', formData, configMultipart);
      
      setMensaje('✅ Actividad creada correctamente con imagen');
      limpiarFormulario();
      fetchActividades(); // Recarga la lista de actividades

    } catch (error) {
      console.error('Error al crear actividad:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.error || 'Error al crear actividad';
      setMensaje(`❌ ${errorMsg}`);
    } finally {
      setCargandoImagen(false);
    }
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
    setActividadSeleccionada(act);
    setModalAbierto(true);
  };

  const handleGuardarEdicion = (nuevosDatos) => {
    if (!token) {
      setMensaje('Error: usuario no autenticado');
      return;
    }
    axios
      .put(`/admin/actividades/${nuevosDatos.id_actividad}`, {
        ...nuevosDatos,
        duracion: parseInt(nuevosDatos.duracion, 10),
        cupo: parseInt(nuevosDatos.cupo, 10),
      }, config)
      .then(() => {
        setMensaje('Actividad actualizada ✅');
        setModalAbierto(false);
        setActividadSeleccionada(null);
        fetchActividades();
      })
      .catch(() => setMensaje('Error al editar ❌'));
  };

  return (
    <div className="admin-container">
      <h2>Panel de Administración</h2>

      <form onSubmit={crearActividad} className="admin-form">
        <h4>Crear Nueva Actividad</h4>
        
        {/* Campos básicos */}
        {['descripcion', 'categoria', 'profesor', 'duracion', 'periodicidad', 'cupo'].map((campo) => (
          <input
            key={campo}
            name={campo}
            placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
            value={form[campo]}
            onChange={handleChange}
            required
            className="admin-input"
            disabled={cargandoImagen}
          />
        ))}

        {/* Campo de imagen */}
        <div className="imagen-upload-container">
          <label htmlFor="imagen" className="imagen-upload-label">
            📸 Seleccionar imagen de la actividad *
          </label>
          <input
            type="file"
            id="imagen"
            accept="image/*"
            onChange={handleImagenChange}
            required
            className="admin-input-file"
            disabled={cargandoImagen}
          />
          
          {/* Vista previa de la imagen */}
          {vistaPrevia && (
            <div className="vista-previa-container">
              <h5>Vista previa:</h5>
              <img src={vistaPrevia} alt="Vista previa" className="vista-previa-imagen" />
              <p className="vista-previa-info">
                📁 {imagenSeleccionada?.name} ({(imagenSeleccionada?.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={cargandoImagen || !imagenSeleccionada}
          className={`admin-submit-btn ${cargandoImagen ? 'loading' : ''}`}
        >
          {cargandoImagen ? '⏳ Creando...' : '✨ Crear Actividad'}
        </button>
      </form>

      {mensaje && <p className={`admin-mensaje ${mensaje.includes('✅') ? 'success' : mensaje.includes('❌') ? 'error' : 'info'}`}>{mensaje}</p>}

      <h4>Actividades Existentes</h4>
      <ul className="admin-actividad-list">
        {actividades.map((act) => (
          <li key={act.id_actividad} className="admin-actividad-item">
            <div className="actividad-info">
              {act.imagen && (
                <img 
                  src={`/${act.imagen}`} 
                  alt={act.descripcion}
                  className="actividad-thumbnail"
                />
              )}
              <div className="actividad-detalles">
                <strong>{act.descripcion}</strong> — {act.categoria} — Prof: {act.profesor}
                <br />
                <small>Imagen: {act.imagen || 'Sin imagen'}</small>
              </div>
            </div>
            <div className="actividad-acciones">
              <button onClick={() => editarActividad(act)} className="admin-btn-editar">Editar</button>
              <button onClick={() => eliminarActividad(act.id_actividad)} className="admin-btn-eliminar">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
      
      <EditarActividadModal
        isOpen={modalAbierto}
        onClose={() => { setModalAbierto(false); setActividadSeleccionada(null); }}
        actividad={actividadSeleccionada}
        onSave={handleGuardarEdicion}
      />
    </div>
  );
}
