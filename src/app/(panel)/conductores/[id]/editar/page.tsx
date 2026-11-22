"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { ConductorResponse } from "@/lib/api-types";
import { api } from "@/lib/client";
import { ConductorForm } from "@/components/ConductorForm";
import { fechaRelativa } from "@/lib/format";

export default function EditarConductorPage({
  params,
}: {
  params: { id: string };
}) {
  const query = useQuery({
    queryKey: ["conductor", params.id],
    queryFn: () => api<ConductorResponse>(`/conductores/${params.id}`),
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <nav className="text-sm text-slate-400">
        <Link href="/conductores" className="text-brand hover:underline">
          Conductores
        </Link>{" "}
        / Editar conductor
      </nav>
      <header>
        <h1 className="text-2xl font-bold text-white">Editar conductor</h1>
        {query.data && (
          <p className="text-sm text-slate-400">
            {query.data.nombreCompleto}, conductor{" "}
            {query.data.activo ? "activo" : "inactivo"} desde el{" "}
            {fechaRelativa(query.data.creadoEn)}.
          </p>
        )}
      </header>

      {query.isLoading && <p className="text-slate-400">Cargando…</p>}
      {query.isError && <p className="text-red-400">No se encontró el conductor.</p>}
      {query.data && (
        <ConductorForm modo="editar" id={params.id} inicial={query.data} />
      )}
    </div>
  );
}
