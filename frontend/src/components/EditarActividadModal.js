import React, { useState, useEffect } from 'react';

export default function EditarActividadModal({ isOpen, onClose, actividad, onSave }) {
    const [form, setForm] = useState({
        descripcion: '',
        categoria: '',
        profesor: '',
        duracion: '',
        periodicidad: '',
        cupo: ''
    });

    useEffect(() => {
        if (actividad) {
            setForm({
                descripcion: actividad.descripcion || '',
                categoria: actividad.categoria || '',
                profesor: actividad.profesor || '',
                duracion: actividad.duracion || '',
                periodicidad: actividad.periodicidad || '',
                cupo: actividad.cupo || ''
            });
        }
    }, [actividad]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.descripcion || !form.categoria || !form.profesor || !form.duracion || !form.periodicidad || !form.cupo) return;
        onSave({ ...actividad, ...form });
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h3 style={{ color: '#fff', marginBottom: 16 }}>Editar Actividad</h3>
                <form onSubmit={handleSubmit}>
                    {['descripcion', 'categoria', 'profesor', 'duracion', 'periodicidad', 'cupo'].map((campo) => (
                        <input
                            key={campo}
                            name={campo}
                            placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
                            value={form[campo]}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            type={campo === 'duracion' || campo === 'cupo' ? 'number' : 'text'}
                            min={campo === 'duracion' || campo === 'cupo' ? 1 : undefined}
                        />
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                        <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancelar</button>
                        <button type="submit" style={styles.saveBtn}>Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(10, 15, 30, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    },
    modal: {
        background: '#23272f',
        borderRadius: 12,
        padding: 32,
        minWidth: 320,
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        color: '#fff',
        maxWidth: 400
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        margin: '8px 0',
        borderRadius: 6,
        border: '1px solid #444',
        background: '#181b22',
        color: '#fff',
        fontSize: 16
    },
    saveBtn: {
        background: '#007bff',
        color: '#fff',
        border: 'none',
        padding: '8px 20px',
        borderRadius: 6,
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: 16
    },
    cancelBtn: {
        background: 'transparent',
        color: '#fff',
        border: '1px solid #444',
        padding: '8px 20px',
        borderRadius: 6,
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: 16
    }
}; 