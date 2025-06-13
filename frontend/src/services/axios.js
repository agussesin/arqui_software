// Importación de la biblioteca axios para realizar peticiones HTTP
import axios from 'axios';

/**
 * Configuración de la instancia de axios
 * 
 * Esta instancia personalizada de axios se utiliza para todas las peticiones HTTP
 * de la aplicación. Incluye configuración base y manejo de autenticación.
 */
const api = axios.create({
  // URL base para todas las peticiones
  baseURL: 'http://localhost:8080',
});

/**
 * Interceptor de peticiones
 * 
 * Este interceptor se ejecuta antes de cada petición HTTP y:
 * 1. Verifica si existe un token de autenticación
 * 2. Si existe, lo añade al header de la petición
 * 3. Permite que la petición continúe o la rechaza si hay error
 */
api.interceptors.request.use(
  (config) => {
    // Obtiene el token del localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Añade el token al header de autorización
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  // Manejo de errores en la configuración de la petición
  (error) => Promise.reject(error)
);

// Exporta la instancia configurada de axios
export default api;

