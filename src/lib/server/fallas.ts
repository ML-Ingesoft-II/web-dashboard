/**
 * Traduce una falla de red al llamar al backend en una respuesta para el panel.
 *
 * Se distinguen dos casos porque significan cosas distintas para el usuario:
 * - Tiempo agotado (504): el backend recibió la petición pero no respondió a
 *   tiempo. La operación pudo haberse completado, así que no conviene reintentar
 *   sin revisar primero.
 * - Sin conexión (503): no se pudo hablar con el backend (apagado, sin red).
 */

export interface RespuestaBackend {
  status: number;
  ok: boolean;
  body: unknown;
}

export const SIN_CONEXION: RespuestaBackend = {
  status: 503,
  ok: false,
  body: {
    title: "Servicio no disponible",
    status: 503,
    detail: "No se pudo conectar con el servidor. Intenta de nuevo en unos minutos.",
  },
};

export const TIEMPO_AGOTADO: RespuestaBackend = {
  status: 504,
  ok: false,
  body: {
    title: "El servidor tardó demasiado",
    status: 504,
    detail:
      "El servidor tardó demasiado en responder. Es posible que el cambio sí se haya guardado: revisa antes de intentarlo de nuevo.",
  },
};

/** Códigos con los que fetch (undici, en Node) reporta que se agotó la espera. */
const CODIGOS_DE_TIEMPO_AGOTADO = new Set([
  "UND_ERR_HEADERS_TIMEOUT",
  "UND_ERR_BODY_TIMEOUT",
  "UND_ERR_CONNECT_TIMEOUT",
]);

export function esTiempoAgotado(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  if (error.name === "TimeoutError") return true;
  const causa = (error as { cause?: { code?: unknown } }).cause;
  return typeof causa?.code === "string" && CODIGOS_DE_TIEMPO_AGOTADO.has(causa.code);
}

export function respuestaDeFalla(error: unknown): RespuestaBackend {
  return esTiempoAgotado(error) ? TIEMPO_AGOTADO : SIN_CONEXION;
}
