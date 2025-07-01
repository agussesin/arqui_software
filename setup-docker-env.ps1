# Script de PowerShell para configurar el archivo .env para Docker

Write-Host "🚀 Configurando variables de entorno para Docker..." -ForegroundColor Green

# Verificar si el archivo .env ya existe
if (Test-Path ".env") {
    Write-Host "⚠️  El archivo .env ya existe. ¿Deseas sobrescribirlo? (y/n)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -eq "y" -or $response -eq "Y") {
        Write-Host "📝 Sobrescribiendo archivo .env..." -ForegroundColor Blue
    } else {
        Write-Host "❌ Operación cancelada." -ForegroundColor Red
        exit 1
    }
}

# Crear el archivo .env para Docker
$envContent = @"
# Configuración de la base de datos para Docker
DB_USER=root
DB_PASSWORD=JACQUESbermanWebster2_
DB_HOST=db
DB_NAME=actividades

# Configuración JWT
JWT_SECRET=loquesea

# Configuración del frontend
REACT_APP_API_URL=http://localhost:8000
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8

Write-Host "✅ Archivo .env creado exitosamente para Docker!" -ForegroundColor Green
Write-Host "📋 Contenido del archivo .env:" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray
Get-Content ".env"
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "🎯 Ahora puedes ejecutar: docker-compose up --build" -ForegroundColor Green 