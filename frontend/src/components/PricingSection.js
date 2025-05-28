
import React from 'react';
import './PricingSection.css';

export default function PricingSection() {
    return (
        <div className="pricing-section" id="planes">
            <h2>Planes</h2>
            <div className="pricing-cards">
                <div className="card plan-free">
                    <h3>Gratis</h3>
                    <p>$0 / mes</p>
                    <ul>
                        <li>Acceso a 1 clase semanal</li>
                        <li>Soporte básico</li>
                    </ul>
                    <a href="/login" className="btn-plan">Registrate para acceder</a>
                </div>

                <div className="card plan-standard">
                    <h3>Pro</h3>
                    <p>$9.99 / mes</p>
                    <ul>
                        <li>Clases ilimitadas</li>
                        <li>Acceso a rutinas</li>
                        <li>Soporte prioridad</li>
                    </ul>
                    <a href="/login" className="btn-plan">Registrate para acceder</a>
                </div>

                <div className="card plan-premium">
                    <h3>Premium</h3>
                    <p>$19.99 / mes</p>
                    <ul>
                        <li>Todo incluido</li>
                        <li>Asesoramiento 1 a 1</li>
                    </ul>
                    <a href="/login" className="btn-plan">Registrate para acceder</a>
                </div>
            </div>
        </div>
    );
}
