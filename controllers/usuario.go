package controllers

import (
	"net/http"
	"os"
	"time"

	"arqui-software/database"
	"arqui-software/models"
	"arqui-software/utils"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// Clave secreta del JWT desde variable de entorno
var jwtKey = []byte(os.Getenv("JWT_SECRET"))

// Estructura del JSON de login
type LoginInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// Login de usuario
func Login(c *gin.Context) {
	var input LoginInput

	// Parsear el JSON recibido
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.Usuario

	// Buscar al usuario por email
	result := database.DB.Where("email = ?", input.Email).First(&user)
	if result.Error != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario no encontrado"})
		return
	}

	// Comparar el hash de la contraseña
	if !utils.CheckPasswordSHA256(input.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Contraseña incorrecta"})
		return
	}

	// Generar el token JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.IdUsuario,
		"role":    user.Rol,
		"exp":     time.Now().Add(time.Hour * 1).Unix(),
	})

	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo generar el token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

// Registro de nuevo usuario
func CrearUsuario(c *gin.Context) {
	var usuario models.Usuario

	if err := c.ShouldBindJSON(&usuario); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Hashear contraseña con SHA256
	usuario.Password = utils.HashPasswordSHA256(usuario.Password)

	if err := database.DB.Create(&usuario).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al guardar el usuario"})
		return
	}

	c.JSON(http.StatusCreated, usuario)
}
