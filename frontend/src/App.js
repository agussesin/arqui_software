import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import PricingSection from './components/PricingSection';
import Navbar from './components/Navbar';
import Actividades from './pages/Actividades';
import ActividadDetalle from './pages/ActividadDetalle';

function App() {
  return (
    <Router>
      {/* NAVBAR SIEMPRE ARRIBA */}
      <Navbar />

      {/* CONTENIDO CAMBIA SEGÚN LA RUTA */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/planes" element={<PricingSection />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/actividades" element={<Actividades />} />
        <Route path="/actividad/:id" element={<ActividadDetalle />} />
      </Routes>
    </Router>
  );
}

export default App;
