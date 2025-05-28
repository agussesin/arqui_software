package utils // Paquete de utilidades generales (helpers)

// Librerías necesarias para hash y conversión
import (
	"crypto/sha256" // Librería para aplicar algoritmo de hash SHA256
	"encoding/hex"  // Para convertir el hash (bytes) a texto hexadecimal
)

// Función que aplica SHA256 a una contraseña en texto plano
func HashPasswordSHA256(password string) string {
	hash := sha256.Sum256([]byte(password)) // Aplica el hash SHA256 a los bytes de la contraseña
	return hex.EncodeToString(hash[:])      // Convierte el resultado (array de bytes) en string hexadecimal
}

// Función que compara una contraseña en texto plano contra un hash
func CheckPasswordSHA256(password string, hash string) bool {
	// Hashea la contraseña ingresada y la compara con el hash almacenado
	return HashPasswordSHA256(password) == hash
}
