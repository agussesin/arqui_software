import React, { useState } from 'react';
import axios from '../services/axios';
import './ActividadCardVisual.css';

const ActividadCardVisual = ({ actividad, id_usuario, usuarioYaInscripto }) => {
    const [expandida, setExpandida] = useState(false);
    const [inscripto, setInscripto] = useState(usuarioYaInscripto);
    const [inscriptos, setInscriptos] = useState(actividad.inscriptos || 0);
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const cupoMaximo = actividad.cupoMaximo || actividad.cupo;
    const cuposRestantes = cupoMaximo - inscriptos;

    const nombre = actividad.descripcion?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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

    // INSCRIBIRSE
    const handleInscribirse = async (e) => {
        e.stopPropagation();
        setLoading(true);
        setMensaje('');
        try {
            const res = await axios.post('/inscripciones', {
                id_usuario,
                id_actividad: actividad.id_actividad || actividad.id
            });
            setInscripto(true);
            setInscriptos(prev => prev + 1);
            setMensaje(res.data.mensaje || '¡Inscripción exitosa!');
        } catch (err) {
            if (err.response?.data?.error) {
                setMensaje(err.response.data.error);
            } else {
                setMensaje('No se pudo inscribir.');
            }
        } finally {
            setLoading(false);
        }
    };

    // DESINSCRIBIRSE
    const handleDesinscribirse = async (e) => {
        e.stopPropagation();
        setLoading(true);
        setMensaje('');
        try {
            const res = await axios.delete(`/inscripciones/${id_usuario}/${actividad.id_actividad || actividad.id}`);
            setInscripto(false);
            setInscriptos(prev => prev - 1);
            setMensaje(res.data.mensaje || 'Te desinscribiste correctamente.');
        } catch (err) {
            if (err.response?.data?.mensaje) {
                setMensaje(err.response.data.mensaje);
            } else if (err.response?.data?.error) {
                setMensaje(err.response.data.error);
            } else {
                setMensaje('No se pudo desinscribir.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`actividad-visual-card${expandida ? ' expandida' : ''}`} style={{ cursor: 'pointer', transition: 'box-shadow 0.3s' }}>
            {/* Imagen con aspecto 16:9 y overlay sin blur */}
            <div className="actividad-img-16-9" style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                <img
                    src={imagen}
                    alt={actividad.descripcion}
                    width={1600}
                    height={900}
                    className="w-full h-full object-cover actividad-visual-imagen"
                    style={{ filter: 'none', opacity: 1, display: 'block' }}
                    draggable={false}
                    loading="lazy"
                />
                <div className="actividad-visual-overlay" style={{ background: 'rgba(20,20,20,0.20)', backdropFilter: 'none' }}>
                    <h2>{actividad.descripcion}</h2>
                    <p>{actividad.profesor} · {actividad.categoria}</p>
                    <button
                        className="expand-btn"
                        onClick={e => { e.stopPropagation(); setExpandida((prev) => !prev); }}
                        style={{
                            marginTop: 12,
                            background: expandida ? '#222' : '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            padding: '6px 18px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: 15,
                            transition: 'background 0.3s'
                        }}
                    >
                        {expandida ? 'Ocultar detalle' : 'Ver más'}
                    </button>
                </div>
            </div>
            <div
                className={`actividad-expandible${expandida ? ' expandible-abierta' : ''}`}
                style={{
                    maxHeight: expandida ? 500 : 0,
                    opacity: expandida ? 1 : 0,
                    padding: expandida ? '1.2rem' : '0 1.2rem',
                    background: '#23272f',
                    color: '#fff',
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    boxShadow: expandida ? '0 4px 24px rgba(0,0,0,0.25)' : 'none',
                    overflow: 'hidden',
                    transition: 'all 0.5s cubic-bezier(.4,2,.6,1)',
                    marginTop: expandida ? 0 : -20
                }}
                onClick={e => e.stopPropagation()}
            >
                {expandida && (
                    <div className="actividad-expandible-content">
                        <p><strong>Descripción:</strong> {actividad.descripcion}</p>
                        <p><strong>Profesor:</strong> {actividad.profesor}</p>
                        <p><strong>Categoría:</strong> {actividad.categoria}</p>
                        <p><strong>Duración:</strong> {actividad.duracion} minutos</p>
                        <p><strong>Periodicidad:</strong> {actividad.periodicidad}</p>
                        <p><strong>Cupo disponible:</strong> {cuposRestantes} / {cupoMaximo}</p>
                        {!inscripto ? (
                            <button
                                className={`actividad-btn-inscribirse${cuposRestantes <= 0 ? ' disabled' : ''}`}
                                onClick={handleInscribirse}
                                disabled={cuposRestantes <= 0 || loading}
                            >
                                {cuposRestantes <= 0 ? 'Cupo completo' : loading ? 'Procesando...' : 'Inscribirme'}
                            </button>
                        ) : (
                            <button
                                className="actividad-btn-desinscribirse"
                                onClick={handleDesinscribirse}
                                disabled={loading}
                            >
                                {loading ? 'Procesando...' : 'Desinscribirme'}
                            </button>
                        )}
                        {mensaje && <div className={`actividad-card-msg${mensaje.includes('éxito') || mensaje.includes('correctamente') ? ' success' : ' error'}`}>{mensaje}</div>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActividadCardVisual;
