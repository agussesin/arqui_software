import React from 'react';
import './Home.css';
import PricingSection from '../components/PricingSection';

/**
 * Componente Home
 * 
 * Esta es la página principal de la aplicación que incluye:
 * 1. Una sección hero con imagen de fondo
 * 2. Una sección de planes de precios
 * 3. Un botón de llamada a la acción
 */
export default function Home() {
  return (
    <div>
      {/* Sección Hero Principal */}
      <div
        className="landing"
        style={{
          backgroundImage: "url('/hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          filter: 'grayscale(100%)', // Efecto de escala de grises
        }}
      >
        {/* Contenido del Hero */}
        <div className="hero">
          <h1>THE GYM SALE UPGRADED</h1>
          <p className="descripcion">Tu primer mes es gratis. Cupos limitados.</p>
          {/* Botón de llamada a la acción que lleva a la sección de planes */}
          <a href="#planes" className="cta-btn">Ver planes</a>
        </div>
      </div>

      {/* Sección de Planes de Precios */}
      <div id="planes">
        <PricingSection />
      </div>

      {/* Botón de llamada a la acción final */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <a href="/login" className="cta-btn">Unite ahora</a>
      </div>
    </div>
  );
}