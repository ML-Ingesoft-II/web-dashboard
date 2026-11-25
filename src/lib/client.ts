import type { ProblemDetails } from "@/lib/api-types";

/**
 * Error de API con el ProblemDetails (RFC 9457) devuelto por el backend/proxy.
 * `status` es 0 cuando ni siquiera se pudo hablar con el servidor de Next.
 */
export class ApiError extends Error {
  status: number;
  problem: ProblemDetails;

  constructor(status: number, problem: ProblemDetails) {
    super(problem.detail || problem.title || `Error ${status}`);
    this.status = status;
    this.problem = problem;
  }
}

/** Ruta del inicio de sesión con el aviso de sesión vencida. */
export const RUTA_SESION_EXPIRADA = "/?motivo=sesion-expirada";

/**
 * Las rutas de autenticación responden 401 por credenciales incorrectas, no
 * por sesión vencida: ahí no se redirige, el formulario muestra el error.
 */
function esRutaDeAutenticacion(path: string): boolean {
  return path.startsWith("/auth/");
}

/** Se puede reemplazar en las pruebas para no navegar de verdad. */
export const navegacion = {
  irA(url: string) {
    window.location.assign(url);
  },
};

function leerCuerpo(texto: string): unknown {
  if (!texto) return null;
  try {
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

/**
 * Cliente del navegador: siempre llama a las rutas internas `/api/*` de Next
 * (mismo origen). Nunca toca tokens; la cookie httpOnly viaja sola.
 *
 * - 401 fuera de /auth: la sesión venció → lleva al inicio de sesión con aviso.
 * - 403: lanza ApiError; la pantalla muestra "no tienes permiso".
 * - Sin conexión: lanza ApiError con status 0.
 */
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
  } catch {
    throw new ApiError(0, {
      title: "Sin conexión",
      detail: "No se pudo conectar con el panel. Revisa tu conexión a internet.",
    });
  }

  const body = leerCuerpo(await res.text());

  if (!res.ok) {
    if (res.status === 401 && !esRutaDeAutenticacion(path)) {
      navegacion.irA(RUTA_SESION_EXPIRADA);
    }
    throw new ApiError(res.status, (body as ProblemDetails) ?? { status: res.status });
  }
  return body as T;
}
