#!/bin/bash

# Script para configurar el archivo .env para Docker

echo "🚀 Configurando variables de entorno para Docker..."

# Verificar si el archivo .env ya existe
if [ -f ".env" ]; then
    echo "⚠️  El archivo .env ya existe. ¿Deseas sobrescribirlo? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "📝 Sobrescribiendo archivo .env..."
    else
        echo "❌ Operación cancelada."
        exit 1
    fi
fi

# Crear el archivo .env para Docker
cat > .env << EOF
# Configuración de la base de datos para Docker
DB_USER=root
DB_PASSWORD=JACQUESbermanWebster2_
DB_HOST=db
DB_NAME=actividades

# Configuración JWT
JWT_SECRET=loquesea

# Configuración del frontend
REACT_APP_API_URL=http://localhost:8000
EOF

echo "✅ Archivo .env creado exitosamente para Docker!"
echo "📋 Contenido del archivo .env:"
echo "----------------------------------------"
cat .env
echo "----------------------------------------"
echo ""
echo "🎯 Ahora puedes ejecutar: docker-compose up --build" 