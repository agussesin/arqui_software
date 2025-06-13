# Frontend Documentation

## Estructura del Proyecto

El frontend está construido utilizando React y sigue una arquitectura moderna y modular. A continuación se detallan los componentes principales y sus funcionalidades:

### Componentes Principales

1. **Navbar (navbar.js)**
   - Barra de navegación principal
   - Maneja la navegación entre secciones
   - Incluye menú responsive
   - Integración con el sistema de autenticación

2. **PricingSection (pricingsection.js)**
   - Muestra los planes y precios disponibles
   - Componente interactivo para selección de planes
   - Integración con el sistema de pagos

### Páginas (src/pages)
Contiene todas las vistas principales de la aplicación:
- Página de inicio
- Página de autenticación
- Página de perfil
- Otras páginas específicas de la aplicación

### Configuración de Axios (axios.js)
- Configuración centralizada para peticiones HTTP
- Manejo de interceptores para tokens de autenticación
- Configuración de base URL y headers por defecto

### App.js
- Componente raíz de la aplicación
- Configuración de rutas
- Proveedor de contexto global
- Manejo de estado global

### Index.js
- Punto de entrada de la aplicación
- Configuración de React y ReactDOM
- Integración con el DOM

## Conexiones Principales

1. **Backend**
   - Comunicación mediante Axios
   - Endpoints configurados en axios.js
   - Manejo de autenticación y tokens

2. **Estado Global**
   - Gestión de estado mediante Context API
   - Manejo de sesión de usuario
   - Estado de la aplicación

3. **Rutas**
   - Implementación de React Router
   - Navegación entre componentes
   - Protección de rutas

## Tecnologías Utilizadas

- React
- Axios para peticiones HTTP
- React Router para navegación
- Context API para estado global
- CSS Modules para estilos

## Instalación y Ejecución

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar en modo desarrollo:
```bash
npm start
```

3. Construir para producción:
```bash
npm run build
``` 