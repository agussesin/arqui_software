package middleware // Este paquete contiene funciones que actúan como filtros intermedios (middleware)

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"     // Framework para manejar solicitudes HTTP
	"github.com/golang-jwt/jwt/v5" // Librería para validar y decodificar tokens JWT
)

// Se obtiene la clave secreta del token desde una variable de entorno
var jwtKey = []byte(os.Getenv("JWT_SECRET"))

// Middleware que valida el JWT Y verifica que el usuario tenga el rol "Admin"
func ValidarTokenYEsAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization") // Extrae el header Authorization

		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token no proporcionado"}) // Si no hay token, responde 401
			c.Abort()
			return
		}

		// Espera que el token esté en formato "Bearer <token>"
		partes := strings.Split(authHeader, " ")
		if len(partes) != 2 || partes[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Formato de token inválido"})
			c.Abort()
			return
		}

		tokenString := partes[1] // El token JWT en sí

		// Intenta parsear el token y verificar su firma
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Método de firma no válido")
			}
			return jwtKey, nil // Devuelve la clave secreta para validar la firma
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token inválido o expirado"})
			c.Abort()
			return
		}

		// Extrae los claims (datos embebidos) del token y verifica que el rol sea "Admin"
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			if role, ok := claims["role"].(string); ok && role == "Admin" {
				c.Next() // Si es admin, continúa con la siguiente función
				return
			}
		}

		// Si no es admin, devuelve error 403 (prohibido)
		c.JSON(http.StatusForbidden, gin.H{"error": "Acceso denegado: se requiere rol administrador"})
		c.Abort()
	}
}
