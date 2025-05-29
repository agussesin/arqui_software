import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import PricingSection from './components/PricingSection';
import Navbar from './components/Navbar';

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
      </Routes>
    </Router>
  );
}

export default App;
