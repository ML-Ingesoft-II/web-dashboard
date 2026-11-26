import "server-only";
import type { TokenResponse } from "@/lib/api-types";
import {
  guardarSesion,
  leerAccessToken,
  leerRefreshToken,
  limpiarSesion,
} from "@/lib/server/session";
import { respuestaDeFalla, type RespuestaBackend } from "@/lib/server/fallas";

export type { RespuestaBackend };

const API = process.env.TIRE_API_URL ?? "http://localhost:8080";

async function parse(res: Response): Promise<unknown> {
  const texto = await res.text();
  if (!texto) return null;
  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}

/** Llama al backend sin autenticacion (login, recuperacion, etc.). */
export async function backendPublico(
  path: string,
  init?: RequestInit
): Promise<RespuestaBackend> {
  try {
    const res = await fetch(`${API}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
      cache: "no-store",
    });
    return { status: res.status, ok: res.ok, body: await parse(res) };
  } catch (error) {
    return respuestaDeFalla(error);
  }
}

async function intentarRefrescar(): Promise<string | null> {
  const refreshToken = leerRefreshToken();
  if (!refreshToken) return null;
  const res = await fetch(`${API}/auth/renovar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const token = (await res.json()) as TokenResponse;
  guardarSesion(token);
  return token.accessToken;
}

/**
 * Llama al backend con el access token de la cookie. Si el backend responde
 * 401, intenta renovar con el refresh token una vez y reintenta. Si aun así
 * responde 401, la sesión ya no sirve: se borran las cookies para que el
 * panel envíe al usuario al inicio de sesión.
 */
export async function backendAutenticado(
  path: string,
  init?: RequestInit
): Promise<RespuestaBackend> {
  let token = leerAccessToken();

  const hacer = async (bearer: string | undefined) =>
    fetch(`${API}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });

  try {
    let res = await hacer(token);
    if (res.status === 401) {
      const nuevo = await intentarRefrescar();
      if (nuevo) {
        token = nuevo;
        res = await hacer(token);
      }
    }
    if (res.status === 401) {
      limpiarSesion();
    }
    return { status: res.status, ok: res.ok, body: await parse(res) };
  } catch (error) {
    return respuestaDeFalla(error);
  }
}
