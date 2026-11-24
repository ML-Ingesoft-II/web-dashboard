import type { ProblemDetails } from "@/lib/api-types";

/**
 * Error de API con el ProblemDetails (RFC 9457) devuelto por el backend/proxy.
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

/**
 * Cliente del navegador: siempre llama a las rutas internas `/api/*` de Next
 * (mismo origen). Nunca toca tokens; la cookie httpOnly viaja sola.
 */
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });

  const texto = await res.text();
  const body = texto ? JSON.parse(texto) : null;

  if (!res.ok) {
    throw new ApiError(res.status, (body as ProblemDetails) ?? { status: res.status });
  }
  return body as T;
}
