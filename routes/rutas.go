// RUTAS (routes/rutas.go)
package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func ConfigurarRutas(r *gin.Engine) {
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"mensaje": "¡Servidor funcionando correctamente, Agus!",
		})
	})
	// Acá podés agregar rutas para usuarios, actividades, inscripciones
	// por ejemplo: GET /usuarios, POST /actividades, etc.
}
