import type { EstadoMonitoreo } from "@/lib/api-types";
import { ETIQUETA_ESTADO } from "@/lib/format";

const ESTILOS: Record<EstadoMonitoreo, string> = {
  NORMAL: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
  PRECAUCION: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
  CRITICO: "bg-red-500/15 text-red-400 ring-red-500/30",
  SIN_SENAL: "bg-slate-500/15 text-slate-300 ring-slate-500/30",
  SIN_VIAJE: "bg-slate-500/10 text-slate-400 ring-slate-500/20",
};

const ICONO: Record<EstadoMonitoreo, string> = {
  NORMAL: "●",
  PRECAUCION: "▲",
  CRITICO: "⊘",
  SIN_SENAL: "⚡",
  SIN_VIAJE: "⏸",
};

export function EstadoBadge({ estado }: { estado: EstadoMonitoreo }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${ESTILOS[estado]}`}
    >
      <span aria-hidden>{ICONO[estado]}</span>
      {ETIQUETA_ESTADO[estado]}
    </span>
  );
}
