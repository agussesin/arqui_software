// MODELOS (models/inscripcion.go)
package models

type Inscripcion struct {
	IdInscripcion uint `json:"id_inscripcion" gorm:"primaryKey"`
	IdUsuario     uint `json:"id_usuario"`
	IdActividad   uint `json:"id_actividad"`
}
