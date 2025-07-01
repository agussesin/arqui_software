# Etapa de construcción
FROM golang:1.24-alpine AS builder

# Instalar dependencias del sistema
RUN apk add --no-cache git

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar go mod y sum files
COPY go.mod go.sum ./

# Descargar dependencias
RUN go mod download

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Etapa de producción
FROM alpine:latest

# Instalar ca-certificates para HTTPS
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copiar el binario desde la etapa de construcción
COPY --from=builder /app/main .

# Exponer el puerto 8000
EXPOSE 8000

# Comando para ejecutar la aplicación
CMD ["./main"] 