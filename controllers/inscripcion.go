package controllers

import (
	"arqui-software/database"
	"arqui-software/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Función para que un socio se inscriba a una actividad
func InscribirseActividad(c *gin.Context) {
	var inscripcion models.Inscripcion

	if err := c.ShouldBindJSON(&inscripcion); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verifica que exista el usuario
	var usuario models.Usuario
	if err := database.DB.First(&usuario, inscripcion.IdUsuario).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return
	}

	// Verifica que exista la actividad
	var actividad models.Actividad
	if err := database.DB.First(&actividad, inscripcion.IdActividad).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Actividad no encontrada"})
		return
	}

	// Inserta la inscripción
	if err := database.DB.Create(&inscripcion).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo registrar la inscripción"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"mensaje": "Inscripción exitosa"})
}

// Función para listar las actividades en las que está inscripto un socio
func ActividadesInscripto(c *gin.Context) {
	idUsuario := c.Param("id_usuario")

	var inscripciones []models.Inscripcion
	if err := database.DB.Where("id_usuario = ?", idUsuario).Find(&inscripciones).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al buscar inscripciones"})
		return
	}

	c.JSON(http.StatusOK, inscripciones)
}
