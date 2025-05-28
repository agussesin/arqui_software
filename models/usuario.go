package models // Este archivo pertenece al paquete "models"

// Definición del modelo Usuario, que representa a los usuarios del sistema
type Usuario struct {
	IdUsuario     uint          `json:"id_usuario" gorm:"primaryKey"` // Clave primaria, identificador único del usuario
	Nombre        string        `json:"nombre"`                       // Nombre del usuario
	Apellido      string        `json:"apellido"`                     // Apellido del usuario
	Email         string        `json:"email"`                        // Email (probablemente único)
	DNI           string        `json:"dni"`                          // Documento Nacional de Identidad
	Telefono      string        `json:"telefono"`                     // Número de teléfono
	Password      string        `json:"password"`                     // Contraseña (debería almacenarse hasheada)
	Rol           string        `json:"rol"`                          // Puede ser "Admin" o "Socio"
	Inscripciones []Inscripcion `gorm:"foreignKey:IdUsuario"`         // Relación uno a muchos con Inscripcion: un usuario puede tener muchas inscripciones
}
