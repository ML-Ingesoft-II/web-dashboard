"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type {
  AtencionEvento,
  EventoHistorial,
  Pagina,
  TipoEvento,
} from "@/lib/api-types";
import { api } from "@/lib/client";
import { ETIQUETA_TIPO_EVENTO, fechaHoraLarga } from "@/lib/format";
import { estadoDeConsulta } from "@/lib/estados";
import { Etiqueta } from "@/components/EstadoBadge";
import { FilaEstado } from "@/components/EstadoVista";
import { Paginacion } from "@/components/Paginacion";

const TAM = 8;

function textoRespuesta(e: EventoHistorial): string {
  const s = e.respuesta.segundos;
  switch (e.respuesta.tipo) {
    case "RESPONDIO":
      return `Respondió en ${s ?? "—"} s`;
    case "VOLVIO_A_CAMARA":
      return `Volvió a la cámara en ${s ?? "—"} s`;
    default:
      return "No respondió";
  }
}

function BadgeAtencion({ atencion }: { atencion: AtencionEvento }) {
  if (atencion === "SIN_ATENDER")
    return (
      <Etiqueta
        clase="bg-tag-critical-bg text-tag-critical-fg"
        icono="critico"
        texto="Sin atender"
      />
    );
  if (atencion === "ATENDIDA")
    return (
      <Etiqueta clase="bg-tag-normal-bg text-tag-normal-fg" icono="normal" texto="Atendida" />
    );
  return <span className="text-sm text-fg-muted">No requiere</span>;
}

export default function HistorialPage() {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [tipo, setTipo] = useState<TipoEvento | "">("");
  const [page, setPage] = useState(0);
  // Filtros aplicados (separados de los campos para el boton "Aplicar").
  const [aplicados, setAplicados] = useState({ desde: "", hasta: "", tipo: "" as TipoEvento | "" });

  const query = useQuery({
    queryKey: ["eventos", aplicados, page],
    queryFn: () => {
      const sp = new URLSearchParams({ page: String(page), size: String(TAM) });
      if (aplicados.desde) sp.set("fechaInicio", `${aplicados.desde}T00:00:00`);
      if (aplicados.hasta) sp.set("fechaFin", `${aplicados.hasta}T23:59:59`);
      if (aplicados.tipo) sp.set("tipoEvento", aplicados.tipo);
      return api<Pagina<EventoHistorial>>(`/eventos?${sp.toString()}`);
    },
  });

  const datos = query.data;
  const total = datos?.totalElementos ?? 0;
  const totalPaginas = datos?.totalPaginas ?? 1;
  const desdeN = total === 0 ? 0 : page * TAM + 1;
  const hastaN = page * TAM + (datos?.contenido.length ?? 0);

  function aplicar() {
    setAplicados({ desde, hasta, tipo });
    setPage(0);
  }
  function limpiar() {
    setDesde("");
    setHasta("");
    setTipo("");
    setAplicados({ desde: "", hasta: "", tipo: "" });
    setPage(0);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-fg">Historial de incidentes</h1>
        <p className="text-sm text-fg-muted">Eventos de fatiga de la flota.</p>
      </header>

      <section className="card">
        <div className="mb-4 grid items-end gap-4 md:grid-cols-5">
          <div>
            <label className="label">Desde</label>
            <input type="date" className="input" value={desde} onChange={(e) => setDesde(e.target.value)} />
          </div>
          <div>
            <label className="label">Hasta</label>
            <input type="date" className="input" value={hasta} onChange={(e) => setHasta(e.target.value)} />
          </div>
          <div>
            <label className="label">Tipo de evento</label>
            <select className="input" value={tipo} onChange={(e) => setTipo(e.target.value as TipoEvento | "")}>
              <option value="">Todos</option>
              <option value="MICROSUENO">Microsueño</option>
              <option value="ROSTRO_NO_VISIBLE">Rostro no visible</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={limpiar} className="btn-secondary">
              Limpiar
            </button>
            <button onClick={aplicar} className="btn-primary">
              Aplicar filtros
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="th">Fecha y hora</th>
                <th className="th">Conductor</th>
                <th className="th">Placa</th>
                <th className="th">Evento</th>
                <th className="th">Respuesta del conductor</th>
                <th className="th">Atención</th>
                <th className="th text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <FilaEstado
                columnas={7}
                estado={estadoDeConsulta(query, (datos?.contenido.length ?? 0) === 0)}
                error={query.error}
                textoVacio={
                  aplicados.desde || aplicados.hasta || aplicados.tipo
                    ? "No hay incidentes con esos filtros."
                    : "Todavía no hay incidentes registrados."
                }
                textoError="No se pudo cargar el historial de incidentes."
                onReintentar={() => query.refetch()}
              />
              {datos?.contenido.map((e) => (
                <tr key={e.id} className="border-b border-border">
                  <td className="td text-fg">{fechaHoraLarga(e.fechaHora)}</td>
                  <td className="td font-medium text-fg">
                    {e.conductor.nombreCompleto}
                  </td>
                  <td className="td">{e.conductor.placaVehiculo ?? "—"}</td>
                  <td className="td">{ETIQUETA_TIPO_EVENTO[e.tipoEvento]}</td>
                  <td className="td">{textoRespuesta(e)}</td>
                  <td className="td">
                    <BadgeAtencion atencion={e.atencion} />
                  </td>
                  <td className="td text-right">
                    {e.alertaId ? (
                      <Link
                        href={`/alertas/${e.alertaId}`}
                        className="btn-secondary min-h-9 px-3 text-sm"
                      >
                        Ver detalle
                      </Link>
                    ) : (
                      <span className="text-xs text-fg-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Paginacion
          mostrando={`Mostrando ${desdeN} a ${hastaN} de ${total} incidentes`}
          pagina={page}
          totalPaginas={totalPaginas}
          onCambio={setPage}
        />
      </section>
    </div>
  );
}
