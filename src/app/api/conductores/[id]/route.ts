import { NextRequest, NextResponse } from "next/server";
import { backendAutenticado } from "@/lib/server/backend";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const r = await backendAutenticado(`/conductores/${params.id}`);
  return NextResponse.json(r.body, { status: r.status });
}

/** Edita o reactiva un conductor. */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.text();
  const r = await backendAutenticado(`/conductores/${params.id}`, {
    method: "PATCH",
    body,
  });
  return NextResponse.json(r.body, { status: r.status });
}

/** Desactiva un conductor (soft delete). */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const r = await backendAutenticado(`/conductores/${params.id}`, {
    method: "DELETE",
  });
  return NextResponse.json(r.body, { status: r.status });
}
