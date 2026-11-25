import { ApiError } from "@/lib/client";

/**
 * Lógica de presentación de los estados de una pantalla (sin React, para
 * poder probarla sola): cargando, error, sin permiso, vacío o con datos.
 */
export type EstadoPantalla = "cargando" | "error" | "sinPermiso" | "vacio" | "ok";

export interface ConsultaResumida {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

export function esSinPermiso(error: unknown): boolean {
  return error instanceof ApiError && error.status === 403;
}

/**
 * Decide qué mostrar a partir de una consulta de TanStack Query.
 * `esVacio` indica si los datos llegaron pero no traen elementos.
 */
export function estadoDeConsulta(
  consulta: ConsultaResumida,
  esVacio: boolean
): EstadoPantalla {
  if (consulta.isLoading) return "cargando";
  if (consulta.isError) return esSinPermiso(consulta.error) ? "sinPermiso" : "error";
  return esVacio ? "vacio" : "ok";
}

/** Texto para el usuario a partir de un error de la API. */
export function mensajeDeError(error: unknown, respaldo: string): string {
  if (!(error instanceof ApiError)) return respaldo;
  switch (error.status) {
    case 0:
    case 503:
      return error.problem.detail || "No se pudo conectar con el servidor.";
    case 401:
      return "Tu sesión expiró. Vuelve a iniciar sesión.";
    case 403:
      return "Tu usuario no tiene permiso para esta acción.";
    default:
      return error.problem.detail || respaldo;
  }
}
