package models

type Actividad struct {
	IdActividad   uint          `json:"id_actividad" gorm:"primaryKey"`
	Descripcion   string        `json:"descripcion"`
	Periodicidad  string        `json:"periodicidad"`
	Cupo          int           `json:"cupo"`
	Duracion      int           `json:"duracion"`
	Categoria     string        `json:"categoria"`
	Profesor      string        `json:"profesor"`
	Inscripciones []Inscripcion `gorm:"foreignKey:IdActividad"`
}
