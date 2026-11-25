"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { ConductorResponse } from "@/lib/api-types";
import { api, ApiError } from "@/lib/client";
import { estadoDeConsulta } from "@/lib/estados";
import { Aviso } from "@/components/Aviso";
import { EstadoVista } from "@/components/EstadoVista";
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
      <nav className="text-sm text-fg-muted">
        <Link href="/conductores" className="text-primary-text hover:underline">
          Conductores
        </Link>{" "}
        / Editar conductor
      </nav>
      <header>
        <h1 className="text-2xl font-bold text-fg">Editar conductor</h1>
        {query.data && (
          <p className="text-sm text-fg-muted">
            {query.data.nombreCompleto}, conductor{" "}
            {query.data.activo ? "activo" : "inactivo"} desde el{" "}
            {fechaRelativa(query.data.creadoEn)}.
          </p>
        )}
      </header>

      {query.error instanceof ApiError && query.error.status === 404 ? (
        <Aviso titulo="No se encontró el conductor.">
          Es posible que el enlace esté incompleto. Vuelve al listado de conductores.
        </Aviso>
      ) : (
        <EstadoVista
          estado={estadoDeConsulta(query, false)}
          error={query.error}
          textoVacio=""
          textoError="No se pudo cargar el conductor."
          onReintentar={() => query.refetch()}
        />
      )}
      {query.data && (
        <ConductorForm modo="editar" id={params.id} inicial={query.data} />
      )}
    </div>
  );
}
