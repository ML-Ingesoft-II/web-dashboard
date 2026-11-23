# Estado del cliente web frente a los criterios del Prototipo

Evaluación del panel del despachador (`web-dashboard`, Next.js) contra los
criterios (a)–(e) exigidos. Hecha a partir del código real.

## Resumen

| Criterio | Estado |
|---|---|
| (a) Login real + `Authorization: Bearer` + guardado seguro del token | ✅ Cumple |
| (b) Flujo del MVP: listar, ver detalle, crear + una operación más | ✅ Cumple |
| (c) Estados de la interfaz (cargando / vacío / error, 401→login, 403→mensaje) | ⚠️ Parcial |
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

### (c) Estados de la interfaz — ⚠️ Parcial

Cubierto:

- **Cargando:** todas las pantallas con datos muestran estado de carga
  (`isLoading` / "Cargando…"); las acciones muestran "Guardando…".
- **Éxito:** render de datos y navegación tras crear/editar/atender.
- **Vacío (parcial):** la tarjeta de alerta muestra "No hay alertas críticas sin
  atender".
- **Error (parcial):** el login muestra el error; el detalle de alerta y la
  edición de conductor muestran "No se encontró…".

Pendiente:

1. **Estado de error** en las pantallas de lista `flota`, `conductores` e
   `historial` (hoy no muestran mensaje si la consulta falla).
2. **Estado vacío** en las tablas (p. ej. "No hay conductores en ruta",
   "Sin incidentes en el rango").
3. **401 → inicio de sesión:** si el refresh también falla, el cliente aún no
   redirige automáticamente al login desde `api()`.
4. **403 → mensaje de permiso insuficiente:** falta un manejo explícito que
   muestre "no tienes permiso" ante un `403`.

Trabajo estimado para cerrarlo: un manejo global de `401`/`403` en el cliente
(`src/lib/client.ts`) más un componente reutilizable de estado (vacío/error) en
las tres pantallas de lista.

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
