"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AlertaDetalleResponse } from "@/lib/api-types";
import { api } from "@/lib/client";
import { MapaUbicacion } from "@/components/MapaUbicacion";
import {
  ETIQUETA_TIPO_EVENTO,
  fechaHoraLarga,
  haceCuanto,
  horaLarga,
  segundos,
  tiempoEnViaje,
} from "@/lib/format";

export default function DetalleAlertaPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const qc = useQueryClient();
  const [notas, setNotas] = useState("");

  const alerta = useQuery({
    queryKey: ["alerta", params.id],
    queryFn: () => api<AlertaDetalleResponse>(`/alertas/${params.id}`),
  });

  const atender = useMutation({
    mutationFn: () =>
      api(`/alertas/${params.id}/atender`, {
        method: "PATCH",
        body: JSON.stringify({ notas: notas.trim() || null }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alerta", params.id] });
      qc.invalidateQueries({ queryKey: ["alertas"] });
      qc.invalidateQueries({ queryKey: ["flota-estado"] });
    },
  });

  if (alerta.isLoading) {
    return <p className="text-slate-400">Cargando…</p>;
  }
  if (alerta.isError || !alerta.data) {
    return <p className="text-red-400">No se encontró la alerta.</p>;
  }

  const a = alerta.data;
  const atendida = a.atendida;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <nav className="text-sm text-slate-400">
        <Link href="/flota" className="text-brand hover:underline">
          Estado de la flota
        </Link>{" "}
        / {atendida ? "Incidente" : "Alerta crítica"}
      </nav>

      <header className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-white">
          Detalle de {atendida ? "incidente" : "alerta crítica"}
        </h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            atendida
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-red-500/15 text-red-400"
          }`}
        >
          {atendida ? "✓ Atendida" : "⊘ Sin atender"}
        </span>
      </header>

      {/* Banner */}
      <div
        className={`rounded-2xl p-5 text-white ${
          atendida ? "bg-slate-800" : "bg-red-600"
        }`}
      >
        <p className="text-xs font-bold uppercase tracking-wide">
          {atendida ? "Incidente atendido" : "Alerta crítica, sin atender"}
        </p>
        <p className="mt-1 text-lg font-bold">
          {a.conductor.nombreCompleto} no respondió a la alarma de microsueño
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Dato etiqueta="Tipo de evento" valor="Microsueño sin respuesta" />
          {atendida ? (
            <>
              <Dato etiqueta="Hora del evento" valor={horaLarga(a.fechaEvento)} />
              <Dato
                etiqueta="Atendida por"
                valor={`${a.atendidaPor?.nombre ?? "—"}, ${horaLarga(
                  a.fechaAtencion
                )}`}
              />
            </>
          ) : (
            <>
              <Dato
                etiqueta="Tiempo sin respuesta"
                valor={haceCuanto(a.fechaApertura).replace("Hace ", "")}
              />
              <Dato etiqueta="Hora del evento" valor={horaLarga(a.fechaEvento)} />
            </>
          )}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <section className="card">
          <h2 className="mb-4 text-base font-semibold text-slate-100">
            Ubicación del evento
          </h2>
          <MapaUbicacion
            lugar="Cerca de Chocontá, Cundinamarca"
            latitud={a.latitud}
            longitud={a.longitud}
            color={atendida ? "blue" : "red"}
          />
        </section>

        <div className="space-y-5">
          <section className="card">
            <h2 className="mb-4 text-base font-semibold text-slate-100">
              Conductor y vehículo
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Dato etiqueta="Conductor" valor={a.conductor.nombreCompleto} />
              <Dato etiqueta="Placa" valor={a.conductor.placaVehiculo ?? "—"} />
              <Dato etiqueta="Teléfono" valor={a.conductor.telefono ?? "—"} />
              <Dato etiqueta="Tiempo en viaje" valor={tiempoEnViaje(a.fechaInicioViaje)} />
              <Dato etiqueta="Última señal" valor={haceCuanto(a.ultimaSenalEn)} />
              <Dato etiqueta="Ojos cerrados durante" valor={segundos(a.duracionSegundos)} />
            </div>
          </section>

          <section className="card">
            <h2 className="mb-4 text-base font-semibold text-slate-100">
              Línea de tiempo
            </h2>
            <ol className="space-y-3">
              {a.lineaTiempo.map((e, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
                  <div>
                    <span className="text-slate-400">{horaLarga(e.fechaHora)}</span>{" "}
                    <span className="text-slate-200">{e.descripcion}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      {/* Nota + accion */}
      {atendida ? (
        <section className="card">
          <h2 className="mb-2 text-base font-semibold text-slate-100">
            Nota de atención
          </h2>
          <p className="text-sm text-slate-300">
            {a.notasDespachador || "Sin nota."}
          </p>
          <div className="mt-4 flex justify-end">
            <Link href="/historial" className="btn-primary">
              Volver al historial
            </Link>
          </div>
        </section>
      ) : (
        <section className="card flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label className="label">Nota (opcional)</label>
            <input
              className="input"
              placeholder="Qué hiciste, por ejemplo: llamé al conductor"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => router.push("/flota")} className="btn-ghost">
              Volver
            </button>
            <button
              onClick={() => atender.mutate()}
              disabled={atender.isPending}
              className="btn-primary"
            >
              {atender.isPending ? "Guardando…" : "Marcar como atendida"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{etiqueta}</p>
      <p className="font-semibold text-slate-100">{valor}</p>
    </div>
  );
}
