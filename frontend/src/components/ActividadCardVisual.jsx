import React from 'react';
import './ActividadCardVisual.css';

const ActividadCardVisual = ({ actividad, onVerDetalle }) => {
    const nombre = actividad.descripcion?.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');

    const imagenPorActividad = {
        'spinning': '/images/ride.jpg',
        'megacross': '/images/megacross.jpg',
        'zumba': '/images/zumba.jpg',
        'boxeo': '/images/boxeo.jpg',
        'calistenia': '/images/calistenia.jpg',
        'gap': '/images/gap.jpg',
        'pilates': '/images/pilates.jpg',
        'aerocombat': '/images/aerocombat.jpg',
        'basquet': '/images/basquet.jpg',
        'yoga': '/images/yoga.jpg',
        'cross': '/images/cross.jpg',
    };

    const imagen = imagenPorActividad[nombre] || '/images/default.jpg';

    return (
        <div className="actividad-visual-card" onClick={() => onVerDetalle(actividad)}>
            <img src={imagen} alt={actividad.descripcion} className="actividad-visual-imagen" />
            <div className="actividad-visual-overlay">
                <h2>{actividad.descripcion}</h2>
                <p>{actividad.profesor} · {actividad.categoria}</p>
            </div>
        </div>
    );
};

export default ActividadCardVisual;
