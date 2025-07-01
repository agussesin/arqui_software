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
          {/* Botones de llamada a la acción */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/signup" className="cta-btn">Crear cuenta</a>
            <a href="#planes" className="cta-btn cta-btn-secondary">Ver planes</a>
          </div>
        </div>
      </div>

      {/* Sección de Planes de Precios */}
      <div id="planes">
        <PricingSection />
      </div>

      {/* Botones de llamada a la acción */}
      <div style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/signup" className="cta-btn">Crear cuenta</a>
          <a href="/login" className="cta-btn cta-btn-secondary">Unite ahora</a>
        </div>
      </div>
    </div>
  );
}