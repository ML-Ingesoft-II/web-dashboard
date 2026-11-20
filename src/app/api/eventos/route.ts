import { NextRequest, NextResponse } from "next/server";
import { backendAutenticado } from "@/lib/server/backend";

/** Historial de incidentes del turno (propaga fechas, tipoEvento, conductorId, page, size). */
export async function GET(req: NextRequest) {
  const qs = req.nextUrl.search;
  const r = await backendAutenticado(`/eventos${qs}`);
  return NextResponse.json(r.body, { status: r.status });
}
