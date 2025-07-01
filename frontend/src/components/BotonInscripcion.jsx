import React, { useState } from 'react';
import api from '../services/axios';

/**
 * Botón de inscripción/desinscripción para actividades
 * Props:
 * - actividad: objeto con { id, cupoMaximo, inscriptos }
 * - inscripto: boolean (si el usuario ya está inscripto)
 * - onCambioInscripcion: callback para actualizar el estado en el padre
 */
const BotonInscripcion = ({ actividad, inscripto, onCambioInscripcion }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [inscriptoLocal, setInscriptoLocal] = useState(inscripto);
    const [inscriptos, setInscriptos] = useState(actividad.inscriptos);

    const cupoMaximo = actividad.cupoMaximo || actividad.cupo;
    const cuposRestantes = cupoMaximo - inscriptos;

    const handleInscribir = async () => {
        setLoading(true);
        setError('');
        try {
            await api.post('/inscripciones', {
                id_usuario: Number(localStorage.getItem('id_usuario')),
                id_actividad: Number(actividad.id || actividad.id_actividad)
            });
            setInscriptoLocal(true);
            setInscriptos(inscriptos + 1);
            onCambioInscripcion && onCambioInscripcion(true, inscriptos + 1);
        } catch (e) {
            setError('No se pudo inscribir.');
        } finally {
            setLoading(false);
        }
    };

    const handleDesinscribir = async () => {
        setLoading(true);
        setError('');
        try {
            await api.delete('/inscripciones', {
                data: {
                    id_usuario: Number(localStorage.getItem('id_usuario')),
                    id_actividad: Number(actividad.id || actividad.id_actividad)
                }
            });
            setInscriptoLocal(false);
            setInscriptos(inscriptos - 1);
            onCambioInscripcion && onCambioInscripcion(false, inscriptos - 1);
        } catch (e) {
            setError('No se pudo desinscribir.');
        } finally {
            setLoading(false);
        }
    };

    let buttonText = 'Inscribirme';
    let buttonAction = handleInscribir;
    let buttonDisabled = loading || (cuposRestantes <= 0 && !inscriptoLocal);

    if (cuposRestantes <= 0 && !inscriptoLocal) {
        buttonText = 'Cupo completo';
        buttonDisabled = true;
    } else if (inscriptoLocal) {
        buttonText = 'Desinscribirme';
        buttonAction = handleDesinscribir;
    }

    return (
        <div style={{ marginTop: 16 }}>
            <div style={{ color: '#fff', marginBottom: 8 }}>
                Cupos restantes: <b>{cuposRestantes}</b> / {cupoMaximo}
            </div>
            <button
                onClick={buttonAction}
                disabled={buttonDisabled}
                style={{
                    background: buttonDisabled ? '#444' : '#007bff',
                    color: '#fff',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: 8,
                    fontWeight: 'bold',
                    cursor: buttonDisabled ? 'not-allowed' : 'pointer',
                    fontSize: 16,
                    transition: 'background 0.3s',
                    minWidth: 160
                }}
            >
                {loading ? 'Procesando...' : buttonText}
            </button>
            {error && <div style={{ color: '#ff4c29', marginTop: 8 }}>{error}</div>}
        </div>
    );
};

export default BotonInscripcion; 