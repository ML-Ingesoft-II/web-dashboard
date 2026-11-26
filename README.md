# web-dashboard

Panel web del **despachador** del sistema Tire. Permite supervisar en tiempo real
el estado de la flota, atender las alertas críticas de microsueño, gestionar los
conductores y consultar el historial de incidentes.

Consume el backend [`tire-backend`](../tire-backend) a través de su contrato
OpenAPI.

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** (tema oscuro por defecto con toggle a modo claro)
- **TanStack Query** para el estado del servidor y el refresco automático
- Autenticación con **cookies httpOnly** (los tokens nunca llegan al navegador)

## Requisitos

- Node.js 18.18+ (probado con Node 22)
- El backend `tire-backend` corriendo y accesible (por defecto en
  `http://localhost:8080`), preferiblemente con datos de ejemplo (perfil `seed`).

## Puesta en marcha

### 1. Levantar el backend con datos de ejemplo

Desde `../tire-backend` (ver su README para el detalle):

```bash
docker compose up -d                       # PostgreSQL
SPRING_PROFILES_ACTIVE=seed ./mvnw spring-boot:run
```

El perfil `seed` recrea el esquema y carga la flota **Transportes Andinos**, la
despachadora **Laura Gómez** y 24 conductores con viajes e incidentes de ejemplo.

### 2. Configurar el dashboard

Copia la plantilla de variables de entorno y ajusta si el backend corre en otro puerto u host:

```bash
cp .env.example .env.local
```

Por defecto define:

```bash
TIRE_API_URL=http://localhost:8080
```

### 3. Instalar y ejecutar

```bash
npm install
npm run dev
```

El panel queda disponible en <http://localhost:3000>.

### 4. Pruebas y Cobertura

El dashboard cuenta con pruebas unitarias y de integración del cliente HTTP, lógica de estados de presentación y proxy BFF utilizando **Vitest** y **MSW (Mock Service Worker)**:

```bash
# Ejecutar todas las pruebas
npm test

# Modo interactivo / observador
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

### Credenciales de ejemplo (perfil `seed`)

| Campo | Valor |
|---|---|
| Correo | `laura.gomez@tandinos.co` |
| Contraseña | `Password123` |

## Pantallas

El panel implementa las 10 pantallas del wireframe del Prototipo 1:

| Ruta | Pantalla |
|---|---|
| `/` | Inicio de sesión |
| `/recuperar` | Olvidé mi contraseña |
| `/recuperar/confirmar?token=…` | Definir nueva contraseña |
| `/flota` | Estado de la flota (se actualiza cada 5 s) |
| `/alertas/{id}` | Detalle de alerta crítica / de incidente atendido |
| `/conductores` | Listado de conductores |
| `/conductores/nuevo` | Registrar conductor |
| `/conductores/{id}/editar` | Editar conductor |
| `/historial` | Historial de incidentes |

## Autenticación (cookies httpOnly)

El navegador nunca maneja los tokens. El flujo es:

1. El cliente llama a las rutas internas `/api/*` de Next (mismo origen).
2. Esos route handlers actúan como **proxy** al backend y guardan el
   `accessToken` y el `refreshToken` en **cookies httpOnly** (inaccesibles desde
   JavaScript). Solo los datos no sensibles de la sesión (nombre, flota) van en
   una cookie legible para pintar la UI.
3. Si el backend responde `401`, el proxy renueva la sesión con el refresh token
   (`POST /auth/renovar`) y reintenta de forma transparente.
4. El panel es exclusivo del rol `DESPACHADOR`; un usuario con otro rol recibe
   `403` al iniciar sesión.

## Estructura

```
src/
  app/
    api/                 # route handlers (proxy al backend + cookies httpOnly)
    (panel)/             # rutas autenticadas con el layout del panel (sidebar)
      flota/             # estado de la flota
      alertas/[id]/      # detalle de alerta / incidente
      conductores/       # listado, alta y edición
      historial/         # historial de incidentes
    page.tsx             # inicio de sesión
    recuperar/           # recuperación de contraseña
  components/            # Sidebar, EstadoBadge, ConductorForm, MapaUbicacion, ...
  lib/
    api-types.ts         # tipos del contrato OpenAPI
    client.ts            # cliente del navegador hacia /api/*
    format.ts            # utilidades de formato (fechas, documentos, estados)
    useTheme.ts          # tema oscuro/claro
    server/              # helpers de servidor (sesión en cookies, fetch al backend)
```

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación de producción |
| `npm run start` | Servir la build de producción |
| `npm run lint` | Linter de Next.js |
| `npm test` | Ejecutar suite de pruebas con Vitest |
| `npm run test:watch` | Pruebas en modo observador |
| `npm run test:coverage` | Generar reporte de cobertura con `@vitest/coverage-v8` |

## Notas

- El mapa de la pantalla de detalle es una representación estilizada (sin
  proveedor externo), coherente con el wireframe.
- Los datos sembrados son un *snapshot*: tras unos minutos, los conductores en
  viaje pueden mostrarse como "Sin señal" porque su última telemetría supera el
  umbral de 2 minutos. Vuelve a sembrar para restablecer el escenario del mockup.
