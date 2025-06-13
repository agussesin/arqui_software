// Importaciones de React Router para el manejo de rutas
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importaciones de componentes y páginas
import Home from './pages/Home';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import PricingSection from './components/PricingSection';
import Navbar from './components/Navbar';
import Actividades from './pages/Actividades';
import ActividadDetalle from './pages/ActividadDetalle';
import MisActividades from './pages/MisActividades';

/**
 * Componente App
 * 
 * Este es el componente raíz de la aplicación que:
 * 1. Configura el enrutamiento de la aplicación
 * 2. Define todas las rutas disponibles
 * 3. Mantiene el Navbar visible en todas las páginas
 * 4. Renderiza el contenido según la ruta actual
 */
function App() {
  return (
    // Router envuelve toda la aplicación para habilitar el enrutamiento
    <Router>
      {/* Navbar siempre visible en todas las páginas */}
      <Navbar />

      {/* Sistema de rutas de la aplicación */}
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<Home />} />
        
        {/* Ruta de autenticación */}
        <Route path="/login" element={<Login />} />
        
        {/* Ruta de planes de precios */}
        <Route path="/planes" element={<PricingSection />} />
        
        {/* Ruta del panel de administración */}
        <Route path="/admin" element={<AdminPanel />} />
        
        {/* Ruta de listado de actividades */}
        <Route path="/actividades" element={<Actividades />} />
        
        {/* Ruta de detalle de actividad específica */}
        <Route path="/actividad/:id" element={<ActividadDetalle />} />
        
        {/* Ruta de actividades del usuario */}
        <Route path="/mis-actividades" element={<MisActividades />} />
      </Routes>
    </Router>
  );
}

export default App;
