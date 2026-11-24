import { NextRequest, NextResponse } from "next/server";
import { backendAutenticado } from "@/lib/server/backend";

/** Lista paginada de conductores de la flota (propaga q, activo, page, size). */
export async function GET(req: NextRequest) {
  const qs = req.nextUrl.search;
  const r = await backendAutenticado(`/conductores${qs}`);
  return NextResponse.json(r.body, { status: r.status });
}

/** Registra un conductor en la flota del despachador. */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const r = await backendAutenticado("/conductores", {
    method: "POST",
    body,
  });
  return NextResponse.json(r.body, { status: r.status });
}
