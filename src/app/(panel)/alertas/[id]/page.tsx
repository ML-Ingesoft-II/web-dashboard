"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AlertaDetalleResponse } from "@/lib/api-types";
import { api, ApiError } from "@/lib/client";
import { estadoDeConsulta, mensajeDeError } from "@/lib/estados";
import { Aviso } from "@/components/Aviso";
import { EstadoVista } from "@/components/EstadoVista";
import { MapaUbicacion } from "@/components/MapaUbicacion";
import { Etiqueta } from "@/components/EstadoBadge";
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

  if (!alerta.data) {
    const noExiste = alerta.error instanceof ApiError && alerta.error.status === 404;
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <nav className="text-sm text-fg-muted">
          <Link href="/flota" className="text-primary-text hover:underline">
            Estado de la flota
          </Link>{" "}
          / Alerta
        </nav>
        {noExiste ? (
          <Aviso titulo="No se encontró la alerta.">
            Es posible que el enlace esté incompleto. Vuelve al estado de la flota.
          </Aviso>
        ) : (
          <EstadoVista
            estado={estadoDeConsulta(alerta, false)}
            error={alerta.error}
            textoVacio=""
            textoError="No se pudo cargar la alerta."
            onReintentar={() => alerta.refetch()}
          />
        )}
      </div>
    );
  }

  const a = alerta.data;
  const atendida = a.atendida;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <nav className="text-sm text-fg-muted">
        <Link href="/flota" className="text-primary-text hover:underline">
          Estado de la flota
        </Link>{" "}
        / {atendida ? "Incidente" : "Alerta crítica"}
      </nav>

      <header className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-fg">
          Detalle de {atendida ? "incidente" : "alerta crítica"}
        </h1>
        {atendida ? (
          <Etiqueta clase="border border-border text-fg-muted" icono="normal" texto="Atendida" />
        ) : (
          <Etiqueta clase="bg-tag-critical-bg text-tag-critical-fg" icono="critico" texto="Sin atender" />
        )}
      </header>

      {/* Banner */}
      <div
        className={`rounded-card p-6 ${
          atendida ? "bg-surface text-fg" : "bg-critical-bg text-on-critical"
        }`}
      >
        <p
          className={`text-sm font-medium uppercase tracking-wide ${
            atendida ? "text-fg-muted" : "text-on-critical-muted"
          }`}
        >
          {atendida ? "Incidente atendido" : "Alerta crítica, sin atender"}
        </p>
        <p className="mt-1 text-lg font-bold">
          {a.conductor.nombreCompleto} no respondió a la alarma de microsueño
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Dato etiqueta="Tipo de evento" valor="Microsueño sin respuesta" enAlerta={!atendida} />
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
                enAlerta
              />
              <Dato etiqueta="Hora del evento" valor={horaLarga(a.fechaEvento)} enAlerta />
            </>
          )}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <section className="card">
          <h2 className="mb-4 text-base font-semibold text-fg">
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
            <h2 className="mb-4 text-base font-semibold text-fg">
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
            <h2 className="mb-4 text-base font-semibold text-fg">
              Línea de tiempo
            </h2>
            <ol className="space-y-3">
              {a.lineaTiempo.map((e, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div>
                    <span className="text-fg-muted">{horaLarga(e.fechaHora)}</span>{" "}
                    <span className="text-fg">{e.descripcion}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      {atender.isError && (
        <Aviso titulo="No se pudo marcar la alerta como atendida.">
          {mensajeDeError(atender.error, "Intenta de nuevo.")}
        </Aviso>
      )}

      {/* Nota + accion */}
      {atendida ? (
        <section className="card">
          <h2 className="mb-2 text-base font-semibold text-fg">
            Nota de atención
          </h2>
          <p className="text-sm text-fg">
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
            <button onClick={() => router.push("/flota")} className="btn-secondary">
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

function Dato({
  etiqueta,
  valor,
  enAlerta = false,
}: {
  etiqueta: string;
  valor: string;
  /** true cuando el dato va sobre la tarjeta roja de alerta crítica. */
  enAlerta?: boolean;
}) {
  return (
    <div>
      <p className={`text-sm ${enAlerta ? "text-on-critical-muted" : "text-fg-muted"}`}>
        {etiqueta}
      </p>
      <p className={`font-medium ${enAlerta ? "text-on-critical" : "text-fg"}`}>{valor}</p>
    </div>
  );
}
