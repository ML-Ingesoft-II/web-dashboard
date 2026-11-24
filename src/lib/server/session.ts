import "server-only";
import { cookies } from "next/headers";
import type { Sesion, TokenResponse } from "@/lib/api-types";

/**
 * Manejo de la sesion del despachador con cookies httpOnly.
 *
 * El access token y el refresh token nunca llegan al navegador: viven en
 * cookies httpOnly que solo el servidor de Next (route handlers) puede leer.
 * Los datos no sensibles de la sesion se guardan en una cookie legible para
 * que la UI muestre el nombre, la flota, etc.
 */

const COOKIE_ACCESS = "tire_access";
const COOKIE_REFRESH = "tire_refresh";
const COOKIE_SESION = "tire_sesion";

const BASE_COOKIE = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export function guardarSesion(token: TokenResponse): void {
  const jar = cookies();
  jar.set(COOKIE_ACCESS, token.accessToken, {
    ...BASE_COOKIE,
    maxAge: token.expiracionSegundos,
  });
  jar.set(COOKIE_REFRESH, token.refreshToken, {
    ...BASE_COOKIE,
    // El refresh vive mas que el access (p. ej. 7 dias).
    maxAge: 60 * 60 * 24 * 7,
  });
  const sesion: Sesion = {
    usuarioId: token.usuarioId,
    nombre: token.nombre,
    rol: token.rol,
    flotaId: token.flotaId,
    nombreFlota: token.nombreFlota,
    debeCambiarPassword: token.debeCambiarPassword,
  };
  // Legible por el cliente para pintar la UI (no contiene tokens).
  jar.set(COOKIE_SESION, JSON.stringify(sesion), {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function limpiarSesion(): void {
  const jar = cookies();
  jar.delete(COOKIE_ACCESS);
  jar.delete(COOKIE_REFRESH);
  jar.delete(COOKIE_SESION);
}

export function leerAccessToken(): string | undefined {
  return cookies().get(COOKIE_ACCESS)?.value;
}

export function leerRefreshToken(): string | undefined {
  return cookies().get(COOKIE_REFRESH)?.value;
}

export function leerSesion(): Sesion | null {
  const raw = cookies().get(COOKIE_SESION)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Sesion;
  } catch {
    return null;
  }
}
