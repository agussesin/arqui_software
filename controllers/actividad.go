package controllers

import (
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "ARQUI_SOFT/models"
    "ARQUI_SOFT/models/database"
)

func ListarActividades(c *gin.Context) {
    var actividades []models.Actividad
    database.DB.Find(&actividades)
    c.JSON(http.StatusOK, actividades)
}

func ObtenerActividadPorID(c *gin.Context) {
    id := c.Param("id")
    var actividad models.Actividad
    if err := database.DB.First(&actividad, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Actividad no encontrada"})
        return
    }
    c.JSON(http.StatusOK, actividad)
}

func CrearActividad(c *gin.Context) {
    var actividad models.Actividad
    if err := c.ShouldBindJSON(&actividad); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    database.DB.Create(&actividad)
    c.JSON(http.StatusOK, actividad)
}

func EditarActividad(c *gin.Context) {
    id := c.Param("id")
    var actividad models.Actividad
    if err := database.DB.First(&actividad, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Actividad no encontrada"})
        return
    }

    if err := c.ShouldBindJSON(&actividad); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    database.DB.Save(&actividad)
    c.JSON(http.StatusOK, actividad)
}

func EliminarActividad(c *gin.Context) {
    id := c.Param("id")
    var actividad models.Actividad
    if err := database.DB.First(&actividad, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Actividad no encontrada"})
        return
    }
    database.DB.Delete(&actividad)
    c.JSON(http.StatusOK, gin.H{"mensaje": "Actividad eliminada"})
}