import React, { useState, useEffect } from 'react';
import api from '../services/axios';
import './BotonInscripcion.css';

/**
 * Botón de inscripción/desinscripción para actividades
 * Props:
 * - actividad: objeto con { id_actividad, cupo, cupos_disponibles, inscriptos }
 * - inscripto: boolean (si el usuario ya está inscripto)
 * - onCambioInscripcion: callback para actualizar el estado en el padre
 */
const BotonInscripcion = ({ actividad, inscripto, onCambioInscripcion }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [inscriptoLocal, setInscriptoLocal] = useState(inscripto);
    const [cuposDisponibles, setCuposDisponibles] = useState(
        actividad.cupos_disponibles !== undefined ? actividad.cupos_disponibles : 
        (actividad.cupo - (actividad.inscriptos || 0))
    );

    // Sincronizar estado local con props cuando cambien
    useEffect(() => {
        setInscriptoLocal(inscripto);
    }, [inscripto]);

    useEffect(() => {
        const cupos = actividad.cupos_disponibles !== undefined ? actividad.cupos_disponibles : 
                     (actividad.cupo - (actividad.inscriptos || 0));
        setCuposDisponibles(cupos);
    }, [actividad.cupos_disponibles, actividad.cupo, actividad.inscriptos]);

    const cupoMaximo = actividad.cupo;
    const idActividad = actividad.id_actividad || actividad.id;
    const idUsuario = Number(localStorage.getItem('id_usuario'));

    const handleInscribir = async () => {
        if (cuposDisponibles <= 0) {
            setError('No hay cupos disponibles');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const response = await api.post('/inscripciones', {
                id_usuario: idUsuario,
                id_actividad: idActividad
            });

            // Actualizar estado local con la respuesta del servidor
            if (response.data.detalles) {
                setCuposDisponibles(response.data.detalles.disponibles);
            } else {
                setCuposDisponibles(prev => prev - 1);
            }

            setInscriptoLocal(true);
            
            // Notificar al componente padre
            if (onCambioInscripcion) {
                onCambioInscripcion(true, cuposDisponibles - 1);
            }

        } catch (error) {
            console.error('Error al inscribirse:', error);
            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError('No se pudo completar la inscripción. Inténtalo de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDesinscribir = async () => {
        setLoading(true);
        setError('');
        
        try {
            const response = await api.delete(`/inscripciones/${idUsuario}/${idActividad}`);

            // Actualizar estado local con la respuesta del servidor
            if (response.data.detalles) {
                setCuposDisponibles(response.data.detalles.disponibles);
            } else {
                setCuposDisponibles(prev => prev + 1);
            }

            setInscriptoLocal(false);
            
            // Notificar al componente padre
            if (onCambioInscripcion) {
                onCambioInscripcion(false, cuposDisponibles + 1);
            }

        } catch (error) {
            console.error('Error al desinscribirse:', error);
            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError('No se pudo completar la desinscripción. Inténtalo de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Determinar el estado del botón
    const getButtonState = () => {
        if (loading) {
            return {
                text: 'Procesando...',
                disabled: true,
                className: 'btn-loading'
            };
        }

        if (inscriptoLocal) {
            return {
                text: 'Desinscribirme',
                disabled: false,
                className: 'btn-desinscribir',
                action: handleDesinscribir
            };
        }

        if (cuposDisponibles <= 0) {
            return {
                text: 'Cupo completo',
                disabled: true,
                className: 'btn-disabled'
            };
        }

        return {
            text: 'Inscribirme',
            disabled: false,
            className: 'btn-inscribir',
            action: handleInscribir
        };
    };

    const buttonState = getButtonState();

    return (
        <div className="boton-inscripcion-container">
            {/* Información de cupos */}
            <div className="cupos-info">
                <span className="cupos-text">
                    Cupos disponibles: <strong>{cuposDisponibles}</strong> / {cupoMaximo}
                </span>
                {cuposDisponibles <= 0 && (
                    <span className="cupo-completo-badge">CUPO COMPLETO</span>
                )}
            </div>

            {/* Botón principal */}
            <button
                onClick={buttonState.action}
                disabled={buttonState.disabled}
                className={`boton-inscripcion ${buttonState.className}`}
            >
                {buttonState.text}
            </button>

            {/* Mensaje de error */}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
        </div>
    );
};

export default BotonInscripcion; 