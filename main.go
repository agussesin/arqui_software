package main // Paquete principal de ejecución

import (
	"arqui-software/database" // Se importa el módulo que se encarga de conectar a la base de datos
	"arqui-software/routes"   // Se importan las rutas definidas

	"github.com/gin-contrib/cors" // Middleware para manejo de CORS (Cross-Origin Resource Sharing)
	"github.com/gin-gonic/gin"    // Framework web principal (Gin)
)

func main() {
	// ======================
	// CONEXIÓN A LA BASE DE DATOS
	// ======================
	database.Conectar() // Ejecuta la conexión y migración automática de las tablas

	// ======================
	// CONFIGURACIÓN DEL SERVIDOR
	// ======================
	r := gin.Default() // Crea una nueva instancia del servidor con configuraciones por defecto (logging, recovery)

	// ======================
	// CONFIGURACIÓN DE HEADERS (para permitir peticiones de otros dominios)
	// ======================
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")

		// Si la petición es de tipo OPTIONS (pre-flight), se responde directamente
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204) // No Content
			return
		}
		c.Next()
	})

	// ======================
	// CONFIGURACIÓN CORS PARA FRONTEND REACT
	// ======================
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Permite conexión desde React (en localhost)
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// ======================
	// CONFIGURAR TODAS LAS RUTAS DE LA APP
	// ======================
	routes.ConfigurarRutas(r) // Carga todas las rutas definidas en routes/rutas.go

	// ======================
	// INICIAR EL SERVIDOR
	// ======================
	r.Run(":8080") // Inicia el servidor en localhost:8080
}
