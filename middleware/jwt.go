package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var jwtKey = []byte(os.Getenv("JWT_SECRET"))

// Middleware para validar JWT y que el rol sea ADMIN
func ValidarTokenYEsAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token no proporcionado"})
			c.Abort()
			return
		}

		partes := strings.Split(authHeader, " ")
		if len(partes) != 2 || partes[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Formato de token inválido"})
			c.Abort()
			return
		}

		tokenString := partes[1]

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Método de firma no válido")
			}
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token inválido o expirado"})
			c.Abort()
			return
		}

		// Extraer claims y validar rol
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			if role, ok := claims["role"].(string); ok && role == "Admin" {
				c.Next()
				return
			}
		}

		c.JSON(http.StatusForbidden, gin.H{"error": "Acceso denegado: se requiere rol administrador"})
		c.Abort()
	}
}
