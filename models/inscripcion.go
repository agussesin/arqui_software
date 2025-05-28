// MODELOS (models/inscripcion.go)
package models // El archivo está dentro del paquete "models"

// Este modelo vincula un usuario con una actividad (relación muchos a muchos)
type Inscripcion struct {
	IdInscripcion uint `json:"id_inscripcion" gorm:"primaryKey"` // Clave primaria para identificar la inscripción
	IdUsuario     uint `json:"id_usuario"`                       // ID del usuario que se inscribe (referencia a Usuario)
	IdActividad   uint `json:"id_actividad"`                     // ID de la actividad en la que se inscribe (referencia a Actividad)
}
