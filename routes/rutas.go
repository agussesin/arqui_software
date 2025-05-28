package routes // Paquete que define todas las rutas de la aplicación

import (
	"arqui-software/controllers" // Importa todos los controladores (funciones que responden a rutas)
	"arqui-software/middleware"  // Middleware para validar JWT

	"net/http" // Para códigos HTTP

	"github.com/gin-gonic/gin" // Framework web Gin
)

// ConfigurarRutas configura todas las rutas de la aplicación
func ConfigurarRutas(r *gin.Engine) {

	// Ruta simple para probar si el servidor está activo
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"mensaje": "¡Servidor funcionando correctamente!",
		})
	})

	// =====================
	// USUARIOS
	// =====================

	// Registro de nuevos usuarios
	r.POST("/usuarios", controllers.CrearUsuario)

	// Login de usuarios y generación de token JWT
	r.POST("/login", controllers.Login)

	// =====================
	// FUNCIONALIDADES SOCIO
	// =====================

	// Obtener lista de todas las actividades (acceso público)
	r.GET("/actividades", controllers.ListarActividades)

	// Obtener información de una actividad específica por ID
	r.GET("/actividades/:id", controllers.ObtenerActividadPorID)

	// Inscribirse a una actividad (requiere pasar id_usuario e id_actividad en el body)
	r.POST("/inscripciones", controllers.InscribirseActividad)

	// Ver actividades en las que está inscripto un usuario
	r.GET("/mis-actividades/:id_usuario", controllers.ActividadesInscripto)

	// =====================
	// FUNCIONALIDADES ADMIN
	// =====================

	// Agrupación de rutas solo accesibles para usuarios con rol "Admin"
	admin := r.Group("/admin")

	// Aplica el middleware que valida JWT y rol de administrador
	admin.Use(middleware.ValidarTokenYEsAdmin())
	{
		// Crear una nueva actividad
		admin.POST("/actividades", controllers.CrearActividad)

		// Editar una actividad existente por ID
		admin.PUT("/actividades/:id", controllers.EditarActividad)

		// Eliminar una actividad por ID
		admin.DELETE("/actividades/:id", controllers.EliminarActividad)
	}
}
