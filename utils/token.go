package utils

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Genera un token JWT con ID y rol del usuario
func GenerarTokenJWT(id uint, rol string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": id,
		"role":    rol,
		"exp":     time.Now().Add(time.Hour * 1).Unix(),
	})

	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}
