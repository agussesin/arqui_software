package models // Pertenece al paquete "models"

// Modelo que representa una actividad (por ejemplo, una clase de spinning o yoga)
type Actividad struct {
	IdActividad   uint          `json:"id_actividad" gorm:"primaryKey"` // Clave primaria de la actividad
	Descripcion   string        `json:"descripcion"`                    // Texto que describe la actividad
	Periodicidad  string        `json:"periodicidad"`                   // Ejemplo: "semanal", "diaria"
	Cupo          int           `json:"cupo"`                           // Número máximo de personas que pueden inscribirse
	Duracion      int           `json:"duracion"`                       // Duración en minutos (o la unidad que uses)
	Categoria     string        `json:"categoria"`                      // Por ejemplo: "Cardio", "Fuerza", etc.
	Profesor      string        `json:"profesor"`                       // Nombre del profesor a cargo
	Inscripciones []Inscripcion `gorm:"foreignKey:IdActividad"`         // Una actividad puede tener muchas inscripciones
}
