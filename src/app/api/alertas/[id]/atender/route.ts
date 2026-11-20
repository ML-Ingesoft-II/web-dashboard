import { NextRequest, NextResponse } from "next/server";
import { backendAutenticado } from "@/lib/server/backend";

/** Marca una alerta como atendida (con nota opcional). */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.text();
  const r = await backendAutenticado(`/alertas/${params.id}/atender`, {
    method: "PATCH",
    body: body || "{}",
  });
  return NextResponse.json(r.body, { status: r.status });
}
