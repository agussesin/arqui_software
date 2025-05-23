package models

import "gorm.io/gorm"

type Usuario struct {
	gorm.Model
	Nombre   string
	Email    string `gorm:"unique"`
	Password string
	Rol      string // "socio" o "admin"
}
