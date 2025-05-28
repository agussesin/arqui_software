package controllers // El paquete "controllers" agrupa los manejadores HTTP (endpoints de la API)

import (
	"net/http" // Para manejar códigos de estado HTTP

	"arqui-software/database" // Importa la conexión a la base de datos
	"arqui-software/models"   // Importa los modelos definidos (como Actividad)

	"github.com/gin-gonic/gin" // Framework web para manejar rutas, respuestas, etc.
)

// ListarActividades devuelve todas las actividades disponibles
func ListarActividades(c *gin.Context) {
	var actividades []models.Actividad // Declara una slice vacía de actividades
	database.DB.Find(&actividades)     // Busca todas las actividades en la base de datos
	c.JSON(http.StatusOK, actividades) // Devuelve las actividades como JSON con código 200
}

// ObtenerActividadPorID busca una actividad por su ID
func ObtenerActividadPorID(c *gin.Context) {
	id := c.Param("id")            // Obtiene el ID de la URL
	var actividad models.Actividad // Crea una variable para guardar la actividad

	if err := database.DB.First(&actividad, id).Error; err != nil { // Busca la actividad por ID
		c.JSON(http.StatusNotFound, gin.H{"error": "Actividad no encontrada"}) // Si no la encuentra, responde 404
		return
	}
	c.JSON(http.StatusOK, actividad) // Si la encuentra, la devuelve como JSON
}

// CrearActividad recibe los datos de una nueva actividad y la guarda
func CrearActividad(c *gin.Context) {
	var actividad models.Actividad                       // Variable para recibir los datos del request
	if err := c.ShouldBindJSON(&actividad); err != nil { // Intenta bindear el JSON del body a la struct
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}) // Si hay error en los datos, responde 400
		return
	}
	database.DB.Create(&actividad)   // Guarda la nueva actividad en la base de datos
	c.JSON(http.StatusOK, actividad) // Devuelve la actividad recién creada
}

// EditarActividad actualiza una actividad existente por su ID
func EditarActividad(c *gin.Context) {
	id := c.Param("id")            // Toma el ID desde la URL
	var actividad models.Actividad // Variable para cargar la actividad existente

	if err := database.DB.First(&actividad, id).Error; err != nil { // Busca la actividad en la base
		c.JSON(http.StatusNotFound, gin.H{"error": "Actividad no encontrada"}) // Si no la encuentra, 404
		return
	}

	if err := c.ShouldBindJSON(&actividad); err != nil { // Intenta actualizar con los nuevos datos del JSON
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}) // Si falla, devuelve 400
		return
	}

	database.DB.Save(&actividad)     // Guarda los cambios en la base
	c.JSON(http.StatusOK, actividad) // Devuelve la actividad actualizada
}

// EliminarActividad borra una actividad existente por su ID
func EliminarActividad(c *gin.Context) {
	id := c.Param("id")            // Toma el ID de la actividad a eliminar
	var actividad models.Actividad // Variable para buscar la actividad

	if err := database.DB.First(&actividad, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Actividad no encontrada"}) // Si no existe, responde 404
		return
	}
	database.DB.Delete(&actividad)                                 // Borra la actividad
	c.JSON(http.StatusOK, gin.H{"mensaje": "Actividad eliminada"}) // Confirma la eliminación
}
