import React, { useState } from 'react';
import BotonInscripcion from './BotonInscripcion';
import './BotonInscripcion.css';

/**
 * Componente de demostración del BotonInscripcion
 * Muestra diferentes estados y configuraciones del botón
 */
const BotonInscripcionDemo = () => {
    const [actividades, setActividades] = useState([
        {
            id_actividad: 1,
            descripcion: "Spinning",
            cupo: 20,
            cupos_disponibles: 15,
            inscriptos: 5
        },
        {
            id_actividad: 2,
            descripcion: "Yoga",
            cupo: 15,
            cupos_disponibles: 0,
            inscriptos: 15
        },
        {
            id_actividad: 3,
            descripcion: "CrossFit",
            cupo: 25,
            cupos_disponibles: 20,
            inscriptos: 5
        }
    ]);

    const [estadosInscripcion, setEstadosInscripcion] = useState({
        1: false, // No inscripto en Spinning
        2: true,  // Inscripto en Yoga
        3: false  // No inscripto en CrossFit
    });

    const handleCambioInscripcion = (idActividad, nuevoEstado, nuevosCupos) => {
        setEstadosInscripcion(prev => ({
            ...prev,
            [idActividad]: nuevoEstado
        }));

        setActividades(prev => prev.map(actividad => 
            actividad.id_actividad === idActividad 
                ? { ...actividad, cupos_disponibles: nuevosCupos }
                : actividad
        ));

        console.log(`Actividad ${idActividad}: ${nuevoEstado ? 'Inscripto' : 'Desinscripto'}`);
        console.log(`Cupos disponibles: ${nuevosCupos}`);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
                🎯 Demo: Botón de Inscripción Mejorado
            </h1>

            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h3>📋 Estados del Botón:</h3>
                <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                    <li><strong>Azul "Inscribirme"</strong>: Usuario no inscripto y hay cupos disponibles</li>
                    <li><strong>Rojo "Desinscribirme"</strong>: Usuario ya inscripto</li>
                    <li><strong>Gris "Cupo completo"</strong>: No hay cupos disponibles</li>
                    <li><strong>Gris "Procesando..."</strong>: Durante la operación</li>
                </ul>
            </div>

            {actividades.map(actividad => (
                <div 
                    key={actividad.id_actividad}
                    style={{
                        border: '1px solid #ddd',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '20px',
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                >
                    <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>
                        {actividad.descripcion}
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'center' }}>
                        <div>
                            <p><strong>Cupo máximo:</strong> {actividad.cupo}</p>
                            <p><strong>Inscriptos:</strong> {actividad.inscriptos}</p>
                            <p><strong>Disponibles:</strong> {actividad.cupos_disponibles}</p>
                            <p><strong>Estado:</strong> 
                                <span style={{ 
                                    color: estadosInscripcion[actividad.id_actividad] ? '#dc3545' : '#007bff',
                                    fontWeight: 'bold',
                                    marginLeft: '5px'
                                }}>
                                    {estadosInscripcion[actividad.id_actividad] ? 'Inscripto' : 'No inscripto'}
                                </span>
                            </p>
                        </div>
                        
                        <div style={{ minWidth: '200px' }}>
                            <BotonInscripcion
                                actividad={actividad}
                                inscripto={estadosInscripcion[actividad.id_actividad]}
                                onCambioInscripcion={(nuevoEstado, nuevosCupos) => 
                                    handleCambioInscripcion(actividad.id_actividad, nuevoEstado, nuevosCupos)
                                }
                            />
                        </div>
                    </div>
                </div>
            ))}

            <div style={{ 
                marginTop: '30px', 
                padding: '20px', 
                backgroundColor: '#e7f3ff', 
                borderRadius: '8px',
                border: '1px solid #b3d9ff'
            }}>
                <h4>💡 Características Implementadas:</h4>
                <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                    <li>✅ Sincronización en tiempo real con la base de datos</li>
                    <li>✅ Actualización automática de cupos disponibles</li>
                    <li>✅ Validación de cupos antes de inscribir</li>
                    <li>✅ Manejo de errores con mensajes claros</li>
                    <li>✅ Diseño responsive y accesible</li>
                    <li>✅ Transacciones seguras en el backend</li>
                    <li>✅ Prevención de inscripciones duplicadas</li>
                    <li>✅ Feedback visual inmediato</li>
                </ul>
            </div>

            <div style={{ 
                marginTop: '20px', 
                padding: '15px', 
                backgroundColor: '#fff3cd', 
                borderRadius: '8px',
                border: '1px solid #ffeaa7'
            }}>
                <h4>🔧 Cómo usar en tu aplicación:</h4>
                <pre style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '10px', 
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '14px'
                }}>
{`import BotonInscripcion from './components/BotonInscripcion';

<BotonInscripcion
  actividad={{
    id_actividad: 1,
    cupo: 20,
    cupos_disponibles: 15
  }}
  inscripto={false}
  onCambioInscripcion={(nuevoEstado, nuevosCupos) => {
    // Manejar el cambio de estado
    console.log('Nuevo estado:', nuevoEstado);
    console.log('Cupos disponibles:', nuevosCupos);
  }}
/>`}
                </pre>
            </div>
        </div>
    );
};

export default BotonInscripcionDemo; 