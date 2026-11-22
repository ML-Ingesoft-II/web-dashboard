"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ConductorResponse, Pagina } from "@/lib/api-types";
import { api } from "@/lib/client";
import { formatearDocumento } from "@/lib/format";

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
          <h1 className="text-2xl font-bold text-white">Conductores</h1>
          <p className="text-sm text-slate-400">
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
              <tr className="border-b border-slate-800">
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
                  <td className="td text-slate-400" colSpan={6}>
                    Cargando…
                  </td>
                </tr>
              )}
              {datos?.contenido.map((c) => (
                <tr key={c.id} className="border-b border-slate-800/60">
                  <td className="td font-medium text-slate-100">
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
                        className="rounded-lg border border-brand/50 px-3 py-1.5 text-xs font-medium text-brand hover:bg-brand/10"
                      >
                        Editar
                      </Link>
                      {c.activo && (
                        <button
                          onClick={() => {
                            if (confirm(`¿Desactivar a ${c.nombreCompleto}?`))
                              desactivar.mutate(c.id);
                          }}
                          className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800"
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

        <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
          <span>
            Mostrando {desde} a {hasta} de {total}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="disabled:opacity-40"
            >
              ‹ Anterior
            </button>
            <span>
              Página {page + 1} de {totalPaginas}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPaginas - 1, page + 1))}
              disabled={page >= totalPaginas - 1}
              className="font-semibold text-slate-200 disabled:opacity-40"
            >
              Siguiente ›
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
