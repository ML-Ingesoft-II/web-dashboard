import { NextRequest, NextResponse } from "next/server";
import type { TokenResponse } from "@/lib/api-types";
import { backendPublico } from "@/lib/server/backend";
import { guardarSesion } from "@/lib/server/session";

/** Inicia sesion: delega en el backend y guarda los tokens en cookies httpOnly. */
export async function POST(req: NextRequest) {
  const credenciales = await req.json();
  const r = await backendPublico("/auth/sesion", {
    method: "POST",
    body: JSON.stringify(credenciales),
  });

  if (!r.ok) {
    return NextResponse.json(r.body, { status: r.status });
  }

  const token = r.body as TokenResponse;
  if (token.rol !== "DESPACHADOR") {
    return NextResponse.json(
      {
        title: "Acceso denegado",
        status: 403,
        detail: "Este panel es solo para despachadores.",
      },
      { status: 403 }
    );
  }

  guardarSesion(token);
  return NextResponse.json({
    rol: token.rol,
    nombre: token.nombre,
    nombreFlota: token.nombreFlota,
    debeCambiarPassword: token.debeCambiarPassword,
  });
}
