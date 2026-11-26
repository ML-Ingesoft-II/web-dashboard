# Estado del cliente web frente a los criterios del Prototipo

Evaluación del panel del despachador (`web-dashboard`, Next.js) contra los
criterios (a)–(e) exigidos. Hecha a partir del código real.

## Resumen

| Criterio | Estado |
|---|---|
| (a) Login real + `Authorization: Bearer` + guardado seguro del token | ✅ Cumple |
| (b) Flujo del MVP: listar, ver detalle, crear + una operación más | ✅ Cumple |
| (c) Estados de la interfaz (cargando / vacío / error, 401→login, 403→mensaje) | ✅ Cumple |
| (d) La vista no llama directamente a la API | ✅ Cumple |
| (e) URL del backend en configuración, no en el código | ✅ Cumple |

## Detalle

### (a) Inicio de sesión real — ✅

- El login se autentica contra el backend (`POST /auth/sesion`) y recibe el JWT real.
- El token se envía como `Authorization: Bearer` en cada petición protegida
  (lo añade `backendAutenticado` en `src/lib/server/backend.ts`).
- El token se guarda en **cookie HttpOnly** (una de las opciones vistas en clase),
  inaccesible desde JavaScript; nunca está escrito en el código.
- Incluye refresh token: ante un `401` del backend, el proxy renueva con
  `POST /auth/renovar` y reintenta de forma transparente.

### (b) Flujo principal del MVP — ✅

Recurso de dominio **Conductor**:

- **Listar:** `GET /conductores` (paginado, con búsqueda y filtro) — pantalla `/conductores`.
- **Ver detalle:** `GET /conductores/{id}` — pantalla `/conductores/{id}/editar`.
- **Crear:** `POST /conductores` — pantalla `/conductores/nuevo`.
- **Operaciones adicionales:** editar (`PATCH /conductores/{id}`) y desactivar
  (`DELETE /conductores/{id}`).

Acción de negocio extra: **atender alerta** (`PATCH /alertas/{id}/atender`) desde
el estado de la flota y el detalle de alerta.

### (c) Estados de la interfaz — ✅

- **Lógica de presentación:** `estadoDeConsulta()` y `mensajeDeError()` en
  `src/lib/estados.ts` deciden qué mostrar (cargando, vacío, error, sin permiso o
  datos) a partir de la consulta. Son funciones sin React, listas para pruebas
  unitarias.
- **Componentes:** `EstadoVista` / `FilaEstado` (`src/components/EstadoVista.tsx`)
  y `Aviso` (`src/components/Aviso.tsx`), con tono neutro: el rojo queda solo
  para las alertas críticas, como pide el sistema de diseño.
- **Cargando / vacío / error / éxito** en `flota`, `conductores`, `historial`,
  detalle de alerta y edición de conductor. Los errores ofrecen "Reintentar". En
  `flota`, si falla una actualización automática se mantienen los últimos datos
  con un aviso.
- **401 → inicio de sesión:** si el refresh token tampoco sirve, el proxy borra
  las cookies (`src/lib/server/backend.ts`) y `api()` (`src/lib/client.ts`)
  lleva a `/?motivo=sesion-expirada`, donde el login muestra "Tu sesión expiró".
- **403 → mensaje:** las pantallas muestran "No tienes permiso"; el login con un
  usuario que no es despachador muestra "Este panel es solo para despachadores".
- **Backend caído:** el proxy responde `503` con un mensaje claro en vez de un
  error 500.

Cómo reproducir cada caso para el video:

| Caso | Pasos |
|---|---|
| 403 | Iniciar sesión con un conductor del perfil `seed` (p. ej. `apineda@tandinos.co` / `Pineda2337`). |
| 401 | Con el panel abierto, borrar las cookies `tire_access` y `tire_refresh` en DevTools (Application → Cookies) y esperar la siguiente actualización de la flota. |
| Error | Apagar el backend con el panel abierto: aparece el aviso con "Reintentar". |
| Vacío | En `conductores` o `historial`, buscar o filtrar algo que no exista. |

### (d) Arquitectura del cliente — ✅

La vista no llama directamente a la API. Cadena de capas:

```
Componente (vista)
  → api()                         (cliente HTTP, src/lib/client.ts)
    → route handler /api/*        (proxy/servicio, src/app/api/**)
      → backendAutenticado()      (cliente del backend, src/lib/server/backend.ts)
        → backend (Spring Boot)
```

Separación por responsabilidades: componentes, cliente HTTP, route handlers
(servicios/proxy), helpers de servidor (sesión en cookies) y tipos del contrato.

### (e) Configuración — ✅

La URL del backend se lee de la variable de entorno `TIRE_API_URL`
(`.env.local`), consumida en `src/lib/server/backend.ts`. No está hardcodeada.
