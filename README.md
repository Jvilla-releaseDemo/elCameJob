# elCameJob

elCameJob es una plataforma digital diseñada para conectar directamente a trabajadores informales y personas desempleadas con clientes potenciales para servicios cotidianos (reparaciones, limpieza, mensajería, etc.).
Nota: Este proyecto es parte del curso de Tecnólogo en Análisis y Desarrollo de Software del SENA.


## Arquitectura Técnica
- **Frontend:** React 19 + TypeScript
- **Estilos:** Tailwind CSS (configuración personalizada en `index.html`)
- **Enrutamiento:** react-router-dom (HashRouter)
- **Persistencia:** localStorage y sessionStorage para simular base de datos y manejo de sesiones
- **Estado Global:** AuthContext para usuario autenticado y notificaciones (Toasts)

## Funcionalidades Implementadas

### 1. Sistema de Autenticación
- **Registro:** Formulario dinámico según tipo de usuario (Cliente o Trabajador)
- **Login:** Validación de credenciales contra usuarios en localStorage
- **Perfiles:**
  - Cliente: Requiere dirección y teléfono
  - Trabajador: Requiere cargo y departamento
- **Sesión:** Persistencia mediante sessionStorage

### 2. Gestión de Trabajos (Jobs)
- **Publicación (Clientes):** Crear ofertas de trabajo especificando título, descripción, presupuesto, categoría y ubicación
- **Exploración (Trabajadores):** Ver lista de trabajos abiertos, filtrados por estado
- **Postulación:** Aplicar a trabajos enviando mensaje de interés

### 3. Dashboard Interactivo
- **Vistas Basadas en Rol:**
  - Trabajador: "Explorar" empleos y "Mis Postulaciones"
  - Cliente: "Mis Publicaciones" y gestión de postulantes
- **Gestión de Postulantes:** Ver detalle de postulantes y (próximamente) aceptar/rechazar

### 4. Interfaz de Usuario (UI/UX)
- **Diseño Moderno:** Bordes redondeados (3rem), sombras suaves, tipografía limpia (SF Pro / Inter)
- **Componentes Reutilizables:**
  - Button: Variantes (primary, outline, ghost)
  - Input: Soporte para iconos y errores
  - Toast: Notificaciones flotantes
  - Logo: Marca animada
- **Feedback Visual:** Loaders, Empty States, transiciones suaves

## Estructura de Archivos Clave
- `App.tsx`: Orquestador principal, rutas y lógica del Dashboard
- `services/authService.ts`: Lógica de registro, login y gestión de usuarios (Mock)
- `services/jobService.ts`: Lógica de creación de empleos y postulaciones (Mock)
- `types.ts`: Definiciones de interfaces y enums (UserType, JobStatus, etc.)
- `components/UI/`: Componentes atómicos de la interfaz


## Licencia
Este proyecto es solo para fines educativos y demostrativos.
