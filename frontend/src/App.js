import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import ActividadDetalle from './pages/ActividadDetalle';
import MisActividades from './pages/MisActividades';

function App() {
  return (
    <Router>
      <Navbar /> {/* Se muestra siempre */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/actividades/:id" element={<ActividadDetalle />} />
        <Route path="/mis-actividades" element={<MisActividades />} />
        {/* Podés seguir agregando más rutas acá */}
      </Routes>
    </Router>
  );
}

export default App;
