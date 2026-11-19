import { NextRequest, NextResponse } from "next/server";
import { backendPublico } from "@/lib/server/backend";

/** Solicita el enlace de recuperacion de contrasena. */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const r = await backendPublico("/auth/recuperacion", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return NextResponse.json(r.body, { status: r.status });
}
