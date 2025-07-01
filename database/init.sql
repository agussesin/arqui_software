-- Script de inicialización de la base de datos
-- Este archivo se ejecuta automáticamente cuando se crea el contenedor de MySQL

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS actividades;

-- Usar la base de datos
USE actividades;

-- Las tablas se crearán automáticamente mediante GORM AutoMigrate
-- Este script puede usarse para datos iniciales si es necesario 