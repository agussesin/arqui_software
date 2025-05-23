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
}
