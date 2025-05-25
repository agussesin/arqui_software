package controllers

import (
    "net/http"
    "os"
    "time"

    "arqui-software/database"
    "arqui-software/models"

    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
    "golang.org/x/crypto/bcrypt"
)

// Se obtiene la clave secreta para firmar el token JWT desde una variable de entorno
var jwtKey = []byte(os.Getenv("JWT_SECRET"))

// Función para hashear contraseñas con bcrypt
func hashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
    return string(bytes), err
}

// Función para comparar una contraseña con su hash almacenado
func checkPasswordHash(password, hash string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
    return err == nil
}

// Estructura que representa los datos necesarios para hacer login
type LoginInput struct {
    Email    string `json:"email" binding:"required"`
    Password string `json:"password" binding:"required"`
}

// Controlador para realizar el login
func Login(c *gin.Context) {
    var input LoginInput

    // Intenta convertir el JSON recibido en el cuerpo a la estructura LoginInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    var user models.Usuario

    // Busca en la base de datos un usuario con ese email
    result := database.DB.Where("email = ?", input.Email).First(&user)
    if result.Error != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario no encontrado"})
        return
    }

    // Compara la contraseña ingresada con la contraseña hasheada
    if !checkPasswordHash(input.Password, user.Password) {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Contraseña incorrecta"})
        return
    }

    // Si es correcto, genera el token JWT con datos útiles del usuario
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "user_id": user.IdUsuario,
        "role":    user.Rol,
        "exp":     time.Now().Add(time.Hour * 1).Unix(), // expira en 1 hora
    })

    // Firma el token con la clave secreta
    tokenString, err := token.SignedString(jwtKey)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo generar el token"})
        return
    }

    // Devuelve el token al cliente
    c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

// Controlador para registrar un nuevo usuario
func CrearUsuario(c *gin.Context) {
    var usuario models.Usuario

    // Intenta convertir el JSON recibido en el cuerpo a la estructura Usuario
    if err := c.ShouldBindJSON(&usuario); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Hashea la contraseña antes de guardarla en la base de datos
    hash, err := hashPassword(usuario.Password)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo encriptar la contraseña"})
        return
    }
    usuario.Password = hash

    // Intenta guardar el nuevo usuario
    if err := database.DB.Create(&usuario).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al guardar el usuario"})
        return
    }

    // Devuelve el usuario recién creado (sin exponer la contraseña)
    c.JSON(http.StatusCreated, usuario)
}