package controllers // Controladores relacionados a las inscripciones

import (
	"arqui-software/database" // Conexión con la base de datos
	"arqui-software/models"   // Modelos de datos (Usuario, Actividad, Inscripcion)
	"net/http"                // Para los códigos de estado HTTP

	"github.com/gin-gonic/gin" // Framework web
)

// Función para que un socio se inscriba a una actividad
func InscribirseActividad(c *gin.Context) {
	var inscripcion models.Inscripcion // Variable para almacenar la inscripción recibida

	// Intenta bindear los datos del JSON recibido al struct Inscripcion
	if err := c.ShouldBindJSON(&inscripcion); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}) // Error si el JSON es inválido
		return
	}

	// Verifica que exista el usuario en la base de datos
	var usuario models.Usuario
	if err := database.DB.First(&usuario, inscripcion.IdUsuario).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"}) // Devuelve 404 si no existe
		return
	}

	// Verifica que exista la actividad en la base de datos
	var actividad models.Actividad
	if err := database.DB.First(&actividad, inscripcion.IdActividad).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Actividad no encontrada"}) // Devuelve 404 si no existe
		return
	}

	// Intenta registrar la inscripción en la base de datos
	if err := database.DB.Create(&inscripcion).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo registrar la inscripción"}) // Error interno
		return
	}

	// Devuelve mensaje de éxito
	c.JSON(http.StatusCreated, gin.H{"mensaje": "Inscripción exitosa"})
}

// Función para listar las actividades en las que está inscripto un socio
func ActividadesInscripto(c *gin.Context) {
	idUsuario := c.Param("id_usuario") // Toma el ID del usuario desde la URL

	var inscripciones []models.Inscripcion
	// Busca todas las inscripciones cuyo id_usuario coincida
	if err := database.DB.Where("id_usuario = ?", idUsuario).Find(&inscripciones).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al buscar inscripciones"}) // Error interno
		return
	}

	type InscripcionConActividad struct {
		IdInscripcion uint             `json:"id_inscripcion"`
		IdUsuario     uint             `json:"id_usuario"`
		IdActividad   uint             `json:"id_actividad"`
		Actividad     models.Actividad `json:"actividad"`
	}

	var resultado []InscripcionConActividad
	for _, insc := range inscripciones {
		var actividad models.Actividad
		if err := database.DB.First(&actividad, insc.IdActividad).Error; err != nil {
			continue // Si no encuentra la actividad, la saltea
		}
		resultado = append(resultado, InscripcionConActividad{
			IdInscripcion: insc.IdInscripcion,
			IdUsuario:     insc.IdUsuario,
			IdActividad:   insc.IdActividad,
			Actividad:     actividad,
		})
	}

	// Devuelve la lista de inscripciones con detalles de la actividad
	c.JSON(http.StatusOK, resultado)
}
