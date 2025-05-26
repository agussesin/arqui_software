package main

import (
	"arqui-software/database" // importa tu paquete de conexión
	"arqui-software/routes"   // importa tus rutas

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin" // framework web
)

func main() {
	// Conectamos a la base de datos
	database.Conectar()
	// Creamos el router con Gin
	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Configuramos CORS para permitir requests desde React
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Configuramos todas las rutas disponibles
	routes.ConfigurarRutas(r)

	// Arrancamos el servidor en el puerto 8080
	r.Run(":8080")
}
