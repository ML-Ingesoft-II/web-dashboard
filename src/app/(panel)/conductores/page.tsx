"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ConductorResponse, Pagina } from "@/lib/api-types";
import { api } from "@/lib/client";
import { formatearDocumento } from "@/lib/format";
import { Paginacion } from "@/components/Paginacion";

const TAM = 8;

export default function ConductoresPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [estado, setEstado] = useState<"activos" | "inactivos" | "todos">("activos");
  const [page, setPage] = useState(0);

  const activoParam =
    estado === "activos" ? "true" : estado === "inactivos" ? "false" : "";

  const query = useQuery({
    queryKey: ["conductores", q, estado, page],
    queryFn: () => {
      const sp = new URLSearchParams({ page: String(page), size: String(TAM) });
      if (q.trim()) sp.set("q", q.trim());
      if (activoParam) sp.set("activo", activoParam);
      return api<Pagina<ConductorResponse>>(`/conductores?${sp.toString()}`);
    },
  });

  const desactivar = useMutation({
    mutationFn: (id: string) => api(`/conductores/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["conductores"] }),
    onError: (e: unknown) => {
      alert(
        e && typeof e === "object" && "message" in e
          ? String((e as { message: string }).message)
          : "No se pudo desactivar."
      );
    },
  });

  const datos = query.data;
  const total = datos?.totalElementos ?? 0;
  const totalPaginas = datos?.totalPaginas ?? 1;
  const desde = total === 0 ? 0 : page * TAM + 1;
  const hasta = page * TAM + (datos?.contenido.length ?? 0);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fg">Conductores</h1>
          <p className="text-sm text-fg-muted">
            {total} conductores {estado === "activos" ? "activos " : ""}en tu flota
          </p>
        </div>
        <Link href="/conductores/nuevo" className="btn-primary">
          + Registrar conductor
        </Link>
      </header>

      <section className="card">
        <div className="mb-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Buscar</label>
            <input
              className="input"
              placeholder="Nombre, documento, correo o placa"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(0);
              }}
            />
          </div>
          <div>
            <label className="label">Estado de la cuenta</label>
            <select
              className="input"
              value={estado}
              onChange={(e) => {
                setEstado(e.target.value as typeof estado);
                setPage(0);
              }}
            >
              <option value="activos">Activos</option>
              <option value="inactivos">Desactivados</option>
              <option value="todos">Todos</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="th">Nombre</th>
                <th className="th">Documento</th>
                <th className="th">Correo</th>
                <th className="th">Teléfono</th>
                <th className="th">Placa</th>
                <th className="th text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {query.isLoading && (
                <tr>
                  <td className="td text-fg-muted" colSpan={6}>
                    Cargando…
                  </td>
                </tr>
              )}
              {datos?.contenido.map((c) => (
                <tr key={c.id} className="border-b border-border">
                  <td className="td font-medium text-fg">
                    {c.nombreCompleto}
                  </td>
                  <td className="td">
                    {formatearDocumento(c.tipoDocumento, c.numeroDocumento)}
                  </td>
                  <td className="td">{c.correo}</td>
                  <td className="td">{c.telefono ?? "—"}</td>
                  <td className="td">{c.placaVehiculo ?? "—"}</td>
                  <td className="td">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/conductores/${c.id}/editar`}
                        className="btn-secondary min-h-9 px-3 text-sm"
                      >
                        Editar
                      </Link>
                      {c.activo && (
                        <button
                          onClick={() => {
                            if (confirm(`¿Desactivar a ${c.nombreCompleto}?`))
                              desactivar.mutate(c.id);
                          }}
                          className="btn-secondary min-h-9 px-3 text-sm"
                        >
                          Desactivar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Paginacion
          mostrando={`Mostrando ${desde} a ${hasta} de ${total}`}
          pagina={page}
          totalPaginas={totalPaginas}
          onCambio={setPage}
        />
      </section>
    </div>
  );
}
