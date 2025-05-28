package database // Este paquete se encarga de la conexión con la base de datos

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv" // Carga variables de entorno desde un archivo .env
	"gorm.io/driver/mysql"     // Driver de MySQL para GORM
	"gorm.io/gorm"             // ORM (Object-Relational Mapping) usado para manejar la DB en Go

	"arqui-software/models" // Modelos que serán usados para crear las tablas
)

// DB es una variable global para acceder a la base de datos desde cualquier parte del proyecto
var DB *gorm.DB

// Función que realiza la conexión a la base de datos
func Conectar() {
	// Cargar las variables desde el archivo .env (DB_USER, DB_PASSWORD, etc.)
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error al cargar el archivo .env") // Si no se puede cargar, se corta la ejecución
	}

	// Leer las variables de entorno
	usuario := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	host := os.Getenv("DB_HOST")
	nombre := os.Getenv("DB_NAME")

	// Construcción del DSN (Data Source Name) para conectarse a MySQL
	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s?parseTime=true", usuario, password, host, nombre)

	// Conectarse a la base de datos con GORM
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Error al conectar a la base de datos:", err)
	}

	fmt.Println("✅ Conexión exitosa a la base de datos")

	DB.AutoMigrate(&models.Usuario{}, &models.Actividad{}, &models.Inscripcion{})
}
func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error al cargar el archivo .env")
	}
}
