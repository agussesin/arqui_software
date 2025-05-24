package models

type Usuario struct {
	IdUsuario     uint          `json:"id_usuario" gorm:"primaryKey"`
	Nombre        string        `json:"nombre"`
	Apellido      string        `json:"apellido"`
	Email         string        `json:"email"`
	DNI           string        `json:"dni"`
	Telefono      string        `json:"telefono"`
	Password      string        `json:"password"`
	Rol           string        `json:"rol"` // "Admin" o "Socio"
	Inscripciones []Inscripcion `gorm:"foreignKey:IdUsuario"`
}
