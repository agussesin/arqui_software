package routes

import (
	"arqui-software/controllers"
	"arqui-software/middleware"

	"net/http"

	"github.com/gin-gonic/gin"
)

func ConfigurarRutas(r *gin.Engine) {

	// Ruta de prueba
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"mensaje": "¡Servidor funcionando correctamente!",
		})
	})

	// =====================
	// USUARIOS
	// =====================
	r.POST("/usuarios", controllers.CrearUsuario) // Registro
	r.POST("/login", controllers.Login)           // Login

	// =====================
	// FUNCIONALIDADES SOCIO
	// =====================
	r.GET("/actividades", controllers.ListarActividades)                    // Ver todas las actividades
	r.GET("/actividades/:id", controllers.ObtenerActividadPorID)            // Ver detalle de una actividad
	r.POST("/inscripciones", controllers.InscribirseActividad)              // Inscribirse a una actividad
	r.GET("/mis-actividades/:id_usuario", controllers.ActividadesInscripto) // Ver actividades inscritas

	// =====================
	// FUNCIONALIDADES ADMIN
	// =====================
	admin := r.Group("/admin")
	admin.Use(middleware.ValidarTokenYEsAdmin()) // Middleware que protege rutas solo para admins
	{
		admin.POST("/actividades", controllers.CrearActividad)
		admin.PUT("/actividades/:id", controllers.EditarActividad)
		admin.DELETE("/actividades/:id", controllers.EliminarActividad)
	}
}
