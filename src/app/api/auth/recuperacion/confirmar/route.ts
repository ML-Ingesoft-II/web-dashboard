import { NextRequest, NextResponse } from "next/server";
import { backendPublico } from "@/lib/server/backend";

/** Define la nueva contrasena con el token del enlace de recuperacion. */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const r = await backendPublico("/auth/recuperacion/confirmar", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return NextResponse.json(r.body, { status: r.status });
}
