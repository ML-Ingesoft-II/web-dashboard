import { NextResponse } from "next/server";
import { backendAutenticado } from "@/lib/server/backend";

/** Alertas criticas abiertas de la flota. */
export async function GET() {
  const r = await backendAutenticado("/alertas");
  return NextResponse.json(r.body, { status: r.status });
}
