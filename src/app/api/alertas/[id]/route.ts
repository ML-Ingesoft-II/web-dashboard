import { NextRequest, NextResponse } from "next/server";
import { backendAutenticado } from "@/lib/server/backend";

/** Detalle de una alerta (abierta o atendida). */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const r = await backendAutenticado(`/alertas/${params.id}`);
  return NextResponse.json(r.body, { status: r.status });
}
