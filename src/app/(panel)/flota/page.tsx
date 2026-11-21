"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AlertaResponse,
  ConductorEnViaje,
  EstadoFlotaResponse,
  EstadoMonitoreo,
} from "@/lib/api-types";
import { api } from "@/lib/client";
import { EstadoBadge } from "@/components/EstadoBadge";
import {
  ETIQUETA_ESTADO,
  fechaRelativa,
  haceCuanto,
  tiempoEnViaje,
} from "@/lib/format";

const TAM_PAGINA = 8;
const ORDEN_FILTRO: EstadoMonitoreo[] = [
  "CRITICO",
  "PRECAUCION",
  "NORMAL",
  "SIN_SENAL",
];

export default function FlotaPage() {
  const qc = useQueryClient();
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<EstadoMonitoreo | "">("");
  const [pagEnViaje, setPagEnViaje] = useState(0);
  const [pagSinViaje, setPagSinViaje] = useState(0);

  const flota = useQuery({
    queryKey: ["flota-estado"],
    queryFn: () => api<EstadoFlotaResponse>("/flota/estado"),
    refetchInterval: 5000,
  });

  const alertas = useQuery({
    queryKey: ["alertas"],
    queryFn: () => api<AlertaResponse[]>("/alertas"),
    refetchInterval: 5000,
  });

  const atender = useMutation({
    mutationFn: (id: string) =>
      api(`/alertas/${id}/atender`, {
        method: "PATCH",
        body: JSON.stringify({}),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alertas"] });
      qc.invalidateQueries({ queryKey: ["flota-estado"] });
    },
  });

  const enViajeFiltrados = useMemo(() => {
    const lista = flota.data?.conductoresEnViaje ?? [];
    const q = busqueda.trim().toLowerCase();
    return lista.filter((c) => {
      const coincideTexto =
        !q ||
        c.conductor.nombreCompleto.toLowerCase().includes(q) ||
        (c.conductor.placaVehiculo ?? "").toLowerCase().includes(q);
      const coincideEstado = !filtroEstado || c.estado === filtroEstado;
      return coincideTexto && coincideEstado;
    });
  }, [flota.data, busqueda, filtroEstado]);

  const sinViaje = flota.data?.conductoresSinViaje ?? [];
  const conteo = flota.data?.conteoPorEstado ?? {};
  const totalEnViaje = flota.data?.conductoresEnViaje.length ?? 0;

  const alertaAbierta = alertas.data?.[0];
  const sinSenal = (flota.data?.conductoresEnViaje ?? []).find(
    (c) => c.estado === "SIN_SENAL"
  );

  const pagEnViajeItems = enViajeFiltrados.slice(
    pagEnViaje * TAM_PAGINA,
    pagEnViaje * TAM_PAGINA + TAM_PAGINA
  );
  const totalPagEnViaje = Math.max(1, Math.ceil(enViajeFiltrados.length / TAM_PAGINA));
  const pagSinViajeItems = sinViaje.slice(
    pagSinViaje * TAM_PAGINA,
    pagSinViaje * TAM_PAGINA + TAM_PAGINA
  );
  const totalPagSinViaje = Math.max(1, Math.ceil(sinViaje.length / TAM_PAGINA));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Estado de la flota</h1>
        <span className="flex items-center gap-2 text-sm text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {flota.isFetching ? "Actualizando…" : "En vivo"}
        </span>
      </header>

      {/* Resumen + banner de alerta critica */}
      <section className="grid gap-4 md:grid-cols-[260px_1fr]">
        <div className="card flex items-center justify-around md:flex-col md:justify-center md:gap-4">
          <Resumen etiqueta="Crítico" valor={conteo.CRITICO ?? 0} color="text-red-400" />
          <Resumen
            etiqueta="Sin señal"
            valor={conteo.SIN_SENAL ?? 0}
            color="text-slate-300"
          />
        </div>

        <div className="space-y-3">
          {alertaAbierta ? (
            <div className="rounded-2xl bg-red-600 p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-wide">
                Alerta crítica
              </p>
              <p className="mt-1 text-lg font-bold">
                {alertaAbierta.conductor.nombreCompleto} no respondió a la alarma de
                microsueño
              </p>
              <p className="text-sm text-red-100">
                Placa {alertaAbierta.conductor.placaVehiculo ?? "—"}.{" "}
                {haceCuanto(alertaAbierta.fechaApertura)}.
              </p>
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/alertas/${alertaAbierta.id}`}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-red-700"
                >
                  Ver detalle
                </Link>
                <button
                  onClick={() => atender.mutate(alertaAbierta.id)}
                  disabled={atender.isPending}
                  className="rounded-xl border border-white/60 px-4 py-2 text-sm font-semibold text-white"
                >
                  Marcar como atendida
                </button>
              </div>
            </div>
          ) : (
            <div className="card text-sm text-slate-400">
              No hay alertas críticas sin atender.
            </div>
          )}

          {sinSenal && (
            <div className="card flex items-center gap-3 text-sm">
              <EstadoBadge estado="SIN_SENAL" />
              <span className="text-slate-300">
                {sinSenal.conductor.nombreCompleto},{" "}
                {sinSenal.conductor.placaVehiculo}. No reporta{" "}
                {haceCuanto(sinSenal.ultimaSenalEn).toLowerCase()}.
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Chips de conteo */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-slate-400">
          En viaje: <strong className="text-slate-200">{totalEnViaje}</strong>
        </span>
        <Chip color="emerald" texto={`Normal: ${conteo.NORMAL ?? 0}`} />
        <Chip color="amber" texto={`Precaución: ${conteo.PRECAUCION ?? 0}`} />
        <span className="text-slate-400">
          Sin viaje: <strong className="text-slate-200">{conteo.SIN_VIAJE ?? 0}</strong>
        </span>
      </div>

      {/* Tabla en viaje */}
      <section className="card">
        <h2 className="mb-4 text-lg font-semibold text-slate-100">En viaje</h2>
        <div className="mb-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Buscar</label>
            <input
              className="input"
              placeholder="Conductor o placa"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPagEnViaje(0);
              }}
            />
          </div>
          <div>
            <label className="label">Estado</label>
            <select
              className="input"
              value={filtroEstado}
              onChange={(e) => {
                setFiltroEstado(e.target.value as EstadoMonitoreo | "");
                setPagEnViaje(0);
              }}
            >
              <option value="">Todos los estados</option>
              {ORDEN_FILTRO.map((e) => (
                <option key={e} value={e}>
                  {ETIQUETA_ESTADO[e]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <TablaEnViaje items={pagEnViajeItems} />

        <Paginacion
          mostrando={`Mostrando ${pagEnViajeItems.length} de ${enViajeFiltrados.length} conductores en viaje`}
          pagina={pagEnViaje}
          totalPaginas={totalPagEnViaje}
          onCambio={setPagEnViaje}
        />
      </section>

      {/* Tabla sin viaje */}
      <section className="card">
        <h2 className="mb-4 text-lg font-semibold text-slate-100">Sin viaje</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="th">Conductor</th>
                <th className="th">Placa</th>
                <th className="th">Estado</th>
                <th className="th">Último viaje</th>
              </tr>
            </thead>
            <tbody>
              {pagSinViajeItems.map((c) => (
                <tr key={c.conductor.id} className="border-b border-slate-800/60">
                  <td className="td">{c.conductor.nombreCompleto}</td>
                  <td className="td">{c.conductor.placaVehiculo ?? "—"}</td>
                  <td className="td">
                    <EstadoBadge estado="SIN_VIAJE" />
                  </td>
                  <td className="td text-slate-400">
                    {fechaRelativa(c.fechaUltimoViaje)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Paginacion
          mostrando={`Mostrando ${pagSinViajeItems.length} de ${sinViaje.length} conductores sin viaje`}
          pagina={pagSinViaje}
          totalPaginas={totalPagSinViaje}
          onCambio={setPagSinViaje}
        />
      </section>
    </div>
  );
}

function Resumen({
  etiqueta,
  valor,
  color,
}: {
  etiqueta: string;
  valor: number;
  color: string;
}) {
  return (
    <div className="text-center">
      <p className="text-sm text-slate-400">{etiqueta}</p>
      <p className={`text-4xl font-bold ${color}`}>{valor}</p>
    </div>
  );
}

function Chip({ color, texto }: { color: "emerald" | "amber"; texto: string }) {
  const clase =
    color === "emerald"
      ? "bg-emerald-500/15 text-emerald-400"
      : "bg-amber-500/15 text-amber-400";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${clase}`}>
      {texto}
    </span>
  );
}

function TablaEnViaje({ items }: { items: ConductorEnViaje[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="th">Conductor</th>
            <th className="th">Placa</th>
            <th className="th">Estado</th>
            <th className="th">Última señal</th>
            <th className="th">Tiempo en viaje</th>
            <th className="th">Última ubicación</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.conductor.id} className="border-b border-slate-800/60">
              <td className="td">
                <Link
                  href={
                    c.alertaAbiertaId
                      ? `/alertas/${c.alertaAbiertaId}`
                      : "/flota"
                  }
                  className={c.alertaAbiertaId ? "text-brand hover:underline" : ""}
                >
                  {c.conductor.nombreCompleto}
                </Link>
              </td>
              <td className="td">{c.conductor.placaVehiculo ?? "—"}</td>
              <td className="td">
                <EstadoBadge estado={c.estado} />
              </td>
              <td className="td text-slate-400">{haceCuanto(c.ultimaSenalEn)}</td>
              <td className="td text-slate-400">{tiempoEnViaje(c.fechaInicio)}</td>
              <td className="td text-slate-400">
                {c.ultimaLatitud != null && c.ultimaLongitud != null
                  ? `${c.ultimaLatitud.toFixed(4)}, ${c.ultimaLongitud.toFixed(4)}`
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Paginacion({
  mostrando,
  pagina,
  totalPaginas,
  onCambio,
}: {
  mostrando: string;
  pagina: number;
  totalPaginas: number;
  onCambio: (p: number) => void;
}) {
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
      <span>{mostrando}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onCambio(Math.max(0, pagina - 1))}
          disabled={pagina === 0}
          className="disabled:opacity-40"
        >
          ‹ Anterior
        </button>
        <span>
          Página {pagina + 1} de {totalPaginas}
        </span>
        <button
          onClick={() => onCambio(Math.min(totalPaginas - 1, pagina + 1))}
          disabled={pagina >= totalPaginas - 1}
          className="font-semibold text-slate-200 disabled:opacity-40"
        >
          Siguiente ›
        </button>
      </div>
    </div>
  );
}
