package main

import (
	"arqui-software/database" // importa tu paquete de conexión

	"arqui-software/routes" // importa tus rutas

	"github.com/gin-gonic/gin" // framework web
)

func main() {
	// Conectamos a la base de datos
	database.Conectar()

	// Creamos el router con Gin
	r := gin.Default()

	// Configuramos todas las rutas disponibles
	routes.ConfigurarRutas(r)

	// Arrancamos el servidor en el puerto 8080
	r.Run(":8080")
}
