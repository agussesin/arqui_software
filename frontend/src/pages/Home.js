import React from 'react';
import './Home.css';
import PricingSection from '../components/PricingSection';

export default function Home() {
  return (
    <div>
      {/* HERO principal */}
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
          filter: 'grayscale(100%)',
        }}
      >
        <div className="hero">
          <h1>THE GYM SALE UPGRADED</h1>
          <p className="descripcion">Tu primer mes es gratis. Cupos limitados.</p>
          <a href="#planes" className="cta-btn">Ver planes</a>
        </div>
      </div>

      {/* SECCIÓN DE PLANES */}
      <div id="planes">
        <PricingSection />
      </div>

      {/* CTA final */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <a href="/login" className="cta-btn">Unite ahora</a>
      </div>
    </div>
  );
}

export default Home;
