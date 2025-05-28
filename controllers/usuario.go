package controllers // Paquete donde se definen los controladores de usuario

import (
	"net/http" // Para manejar códigos de estado HTTP
	"os"       // Para leer variables de entorno
	"time"     // Para trabajar con tiempos (expiración del token)

	"arqui-software/database" // Conexión a la base de datos
	"arqui-software/models"   // Modelos de datos
	"arqui-software/utils"    // Funciones auxiliares como el hash de contraseña

	"github.com/gin-gonic/gin"     // Framework web
	"github.com/golang-jwt/jwt/v5" // Librería para generar tokens JWT
)

// Clave secreta usada para firmar los JWT, obtenida desde una variable de entorno
var jwtKey = []byte(os.Getenv("JWT_SECRET"))

// Estructura para los datos de login recibidos
type LoginInput struct {
	Email    string `json:"email" binding:"required"`    // Campo obligatorio: Email
	Password string `json:"password" binding:"required"` // Campo obligatorio: Password
}

// Función que realiza el login de un usuario
func Login(c *gin.Context) {
	var input LoginInput

	// Intenta parsear el JSON recibido al struct LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}) // Error si faltan datos
		return
	}

	var user models.Usuario

	// Busca en la base de datos un usuario con el email recibido
	result := database.DB.Where("email = ?", input.Email).First(&user)
	if result.Error != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario no encontrado"}) // Si no lo encuentra, devuelve 401
		return
	}

	// Compara la contraseña ingresada con el hash almacenado
	if !utils.CheckPasswordSHA256(input.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Contraseña incorrecta"}) // Si no coincide, devuelve 401
		return
	}

	// Genera un JWT con los claims: ID, rol y expiración (1 hora desde ahora)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.IdUsuario,
		"role":    user.Rol,
		"exp":     time.Now().Add(time.Hour * 1).Unix(),
	})

	// Firma el token con la clave secreta
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo generar el token"})
		return
	}

	// Devuelve el token JWT al cliente
	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

// Función que crea un nuevo usuario
func CrearUsuario(c *gin.Context) {
	var usuario models.Usuario

	// Intenta leer el JSON del cuerpo del request y bindearlo al struct Usuario
	if err := c.ShouldBindJSON(&usuario); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}) // Error si el formato es incorrecto
		return
	}

	// Hashea la contraseña antes de guardarla en la base de datos
	usuario.Password = utils.HashPasswordSHA256(usuario.Password)

	// Intenta guardar el usuario en la base de datos
	if err := database.DB.Create(&usuario).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al guardar el usuario"}) // Error al insertar
		return
	}

	// Devuelve el usuario creado con estado 201
	c.JSON(http.StatusCreated, usuario)
}
