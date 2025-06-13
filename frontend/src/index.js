// Importaciones principales de React
import React from 'react';
import ReactDOM from 'react-dom/client';

// Importaciones de estilos y componentes
import './index.css';
import App from './App';

// Importación del service worker para funcionalidades PWA
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

/**
 * Punto de entrada principal de la aplicación
 * 
 * Este archivo:
 * 1. Crea la raíz de React en el elemento 'root'
 * 2. Renderiza la aplicación dentro de React.StrictMode
 * 3. Configura el service worker para funcionalidades PWA
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza la aplicación dentro de StrictMode para desarrollo
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Configuración del service worker
// Nota: Actualmente desactivado (unregister)
// Para activar PWA, cambiar a register()
serviceWorkerRegistration.unregister();

