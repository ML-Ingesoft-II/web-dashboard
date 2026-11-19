import { NextResponse } from "next/server";
import { limpiarSesion } from "@/lib/server/session";

/** Cierra sesion borrando las cookies de tokens. */
export async function POST() {
  limpiarSesion();
  return NextResponse.json({ ok: true });
}
