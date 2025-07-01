# Dockerización del Proyecto Arqui Software

Este proyecto ha sido completamente dockerizado para facilitar el desarrollo y despliegue.

## Estructura del Proyecto

- **Frontend**: React.js servido con Nginx
- **Backend**: Go con Gin framework
- **Base de datos**: MySQL 8.0

## Requisitos Previos

- Docker
- Docker Compose

## Configuración Inicial

### Opción 1: Usar scripts automáticos

**En Windows (PowerShell):**
```powershell
.\setup-docker-env.ps1
```

**En Linux/Mac:**
```bash
chmod +x setup-docker-env.sh
./setup-docker-env.sh
```

### Opción 2: Configuración manual

1. **Crear el archivo .env** (copiar desde env.docker):
   ```bash
   cp env.docker .env
   ```

2. **Verificar que el archivo .env contenga**:
   ```
   DB_USER=root
   DB_PASSWORD=JACQUESbermanWebster2_
   DB_HOST=db
   DB_NAME=actividades
   REACT_APP_API_URL=http://localhost:8000
   ```

## Comandos para Levantar el Proyecto

### 1. Construir y levantar todos los servicios
```bash
docker-compose up --build
```

### 2. Levantar en segundo plano
```bash
docker-compose up -d --build
```

### 3. Ver logs de todos los servicios
```bash
docker-compose logs -f
```

### 4. Ver logs de un servicio específico
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### 5. Detener todos los servicios
```bash
docker-compose down
```

### 6. Detener y eliminar volúmenes (elimina la base de datos)
```bash
docker-compose down -v
```

## Puertos y URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Base de datos MySQL**: localhost:3306

## Servicios

### Frontend (React + Nginx)
- Puerto: 3000
- Construye la aplicación React y la sirve con Nginx
- Configurado para hacer proxy de las peticiones API al backend

### Backend (Go)
- Puerto: 8000
- Framework: Gin
- Base de datos: MySQL
- ORM: GORM

### Base de Datos (MySQL)
- Puerto: 3306
- Base de datos: actividades
- Usuario: root
- Contraseña: JACQUESbermanWebster2_

## Desarrollo

### Reconstruir un servicio específico
```bash
docker-compose up --build backend
```

### Acceder a un contenedor
```bash
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec db mysql -u root -p
```

### Ver el estado de los servicios
```bash
docker-compose ps
```

## Troubleshooting

### Si la base de datos no se conecta
1. Verificar que el servicio `db` esté corriendo:
   ```bash
   docker-compose ps
   ```

2. Verificar los logs de la base de datos:
   ```bash
   docker-compose logs db
   ```

3. Esperar unos segundos para que MySQL se inicialice completamente.

### Si el frontend no puede conectarse al backend
1. Verificar que ambos servicios estén corriendo
2. Verificar que la variable `REACT_APP_API_URL` esté configurada correctamente
3. Verificar los logs del frontend para errores de conexión

### Limpiar completamente y empezar de nuevo
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## Variables de Entorno

Las variables de entorno están definidas en el archivo `docker-compose.yml` y se pueden modificar según sea necesario:

- `DB_HOST`: Host de la base de datos (db)
- `DB_USER`: Usuario de la base de datos (root)
- `DB_PASSWORD`: Contraseña de la base de datos (JACQUESbermanWebster2_)
- `DB_NAME`: Nombre de la base de datos (actividades)
- `REACT_APP_API_URL`: URL de la API para el frontend

## Diferencias con el entorno local

- **DB_HOST**: Cambia de `localhost` a `db` (nombre del servicio en Docker)
- **Base de datos**: Se crea automáticamente con el nombre `actividades`
- **Red**: Todos los servicios están en la misma red Docker
- **Volúmenes**: La base de datos se persiste en un volumen Docker 