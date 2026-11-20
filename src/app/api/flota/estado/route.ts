import { NextResponse } from "next/server";
import { backendAutenticado } from "@/lib/server/backend";

export async function GET() {
  const r = await backendAutenticado("/flota/estado");
  return NextResponse.json(r.body, { status: r.status });
}
