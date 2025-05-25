package utils

import (
	"crypto/sha256"
	"encoding/hex"
)

// Aplica SHA256 a una contraseña en texto plano
func HashPasswordSHA256(password string) string {
	hash := sha256.Sum256([]byte(password))
	return hex.EncodeToString(hash[:])
}

// Compara texto plano contra un hash (ya encriptado)
func CheckPasswordSHA256(password string, hash string) bool {
	return HashPasswordSHA256(password) == hash
}
