// Importamos React y los hooks necesarios para manejar estado y efectos secundarios
import React, { useEffect, useState } from 'react';

// Importamos el hook que permite obtener los parámetros de la URL (como el id de la actividad)
import { useParams } from 'react-router-dom';

// Importamos la instancia de Axios que tiene la configuración base (como el token y la URL del backend)
import axios from '../services/axios';

// Importamos el archivo de estilos CSS específico de este componente
import './ActividadDetalle.css';

// Definimos el componente funcional ActividadDetalle
function ActividadDetalle() {

  // Obtenemos el parámetro "id" de la URL usando useParams
  const { id } = useParams();

  // Creamos un estado para guardar los datos de la actividad traídos del backend
  const [actividad, setActividad] = useState(null);

  // Creamos un estado para mostrar mensajes de error o confirmación al usuario
  const [mensaje, setMensaje] = useState('');

  // Obtenemos el id del usuario desde localStorage (debe haberse guardado en el login)
  const id_usuario = localStorage.getItem('id_usuario');

  // Cuando se monta el componente, hacemos una petición al backend para obtener la actividad
  useEffect(() => {
    axios.get(`/actividades/${id}`) // Llamamos al endpoint con el id correspondiente
      .then((res) => setActividad(res.data)) // Si la respuesta es exitosa, guardamos la actividad en el estado
      .catch(() => setMensaje('Error al cargar la actividad')); // Si hay error, mostramos un mensaje
  }, [id]); // El efecto se vuelve a ejecutar si cambia el id

  // Función que se ejecuta cuando el usuario hace clic en "Inscribirme"
  const inscribirse = () => {
    // Enviamos una solicitud POST al backend para inscribir al usuario en la actividad
    axios.post('/inscripciones', {
      id_usuario: Number(id_usuario),   // Convertimos el id_usuario a número y lo enviamos
      id_actividad: Number(id)          // Convertimos el id de la actividad también
    })
    .then(() => setMensaje('Inscripción exitosa ✅')) // Si fue exitoso, mostramos mensaje
    .catch(() => setMensaje('Ya estás inscripto ❌')); // Si ya está inscripto o hay error, otro mensaje
  };

  // Mientras no se hayan cargado los datos de la actividad, mostramos un mensaje de carga
  if (!actividad) return <p>Cargando actividad...</p>;

  // Renderizamos el contenido visual del componente
  return (
    <div className="actividad-detalle-main">
      {/* Título de la actividad */}
      <h2>{actividad.descripcion}</h2>

      {/* Datos de la actividad mostrados con etiquetas */}
      <p><strong>Profesor:</strong> {actividad.profesor}</p>
      <p><strong>Categoría:</strong> {actividad.categoria}</p>
      <p><strong>Día:</strong> {actividad.dia}</p>
      <p><strong>Horario:</strong> {actividad.horario}</p>
      <p><strong>Cupo:</strong> {actividad.cupo}</p>
      <p><strong>Duración:</strong> {actividad.duracion} minutos</p>

      {/* Botón para inscribirse */}
      <button onClick={inscribirse} className="actividad-detalle-btn">Inscribirme</button>

      {/* Si hay algún mensaje en estado, lo mostramos */}
      {mensaje && <p className="actividad-detalle-msg">{mensaje}</p>}
    </div>
  );
}

// Exportamos el componente para poder usarlo en App.js u otras partes del proyecto
export default ActividadDetalle;
