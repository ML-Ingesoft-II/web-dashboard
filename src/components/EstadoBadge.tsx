import type { EstadoMonitoreo } from "@/lib/api-types";
import { ETIQUETA_ESTADO } from "@/lib/format";
import { Icono, type NombreIcono } from "@/components/Icono";

/**
 * Etiqueta de estado (StatusTag del sistema de diseño): color, ícono y texto,
 * nunca solo color.
 */
const ESTILOS: Record<EstadoMonitoreo, string> = {
  NORMAL: "bg-tag-normal-bg text-tag-normal-fg",
  PRECAUCION: "bg-tag-warning-bg text-tag-warning-fg",
  CRITICO: "bg-tag-critical-bg text-tag-critical-fg",
  SIN_SENAL: "bg-tag-offline-bg text-tag-offline-fg",
  SIN_VIAJE: "bg-transparent text-fg-muted",
};

const ICONO: Record<EstadoMonitoreo, NombreIcono> = {
  NORMAL: "normal",
  PRECAUCION: "precaucion",
  CRITICO: "critico",
  SIN_SENAL: "sinSenal",
  SIN_VIAJE: "sinViaje",
};

export function EstadoBadge({ estado }: { estado: EstadoMonitoreo }) {
  return <Etiqueta clase={ESTILOS[estado]} icono={ICONO[estado]} texto={ETIQUETA_ESTADO[estado]} />;
}

/** Píldora genérica del sistema de diseño (también para "Atendida", "Sin atender"…). */
export function Etiqueta({
  clase,
  icono,
  texto,
}: {
  clase: string;
  icono: NombreIcono;
  texto: string;
}) {
  return (
    <span
      className={`inline-flex min-h-8 items-center gap-2 whitespace-nowrap rounded-full py-1 pl-2 pr-3 text-sm font-medium ${clase}`}
    >
      <Icono nombre={icono} tamano={18} />
      {texto}
    </span>
  );
}
