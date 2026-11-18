import type { EstadoMonitoreo, TipoDocumento, TipoEvento } from "@/lib/api-types";

/** "Hace 4 s" / "Hace 3 min" / "Hace 2 h" a partir de una fecha ISO. */
export function haceCuanto(iso: string | null | undefined): string {
  if (!iso) return "—";
  const ms = Date.now() - new Date(iso).getTime();
  const seg = Math.max(0, Math.round(ms / 1000));
  if (seg < 60) return `Hace ${seg} s`;
  const min = Math.round(seg / 60);
  if (min < 60) return `Hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `Hace ${h} h`;
  const d = Math.round(h / 24);
  return `Hace ${d} d`;
}

/** "3 h 12 min" de duracion en viaje desde la fecha de inicio. */
export function tiempoEnViaje(inicioIso: string | null | undefined): string {
  if (!inicioIso) return "—";
  const ms = Date.now() - new Date(inicioIso).getTime();
  const totalMin = Math.max(0, Math.floor(ms / 60000));
  const h = Math.floor(totalMin / 60);
  const min = totalMin % 60;
  return `${h} h ${String(min).padStart(2, "0")} min`;
}

/** "Hoy, 4:10 p. m." / "Ayer, 9:40 p. m." / "06/11/2026" segun cercania. */
export function fechaRelativa(iso: string | null | undefined): string {
  if (!iso) return "Nunca";
  const f = new Date(iso);
  const hoy = new Date();
  const ayer = new Date();
  ayer.setDate(hoy.getDate() - 1);
  const hora = f.toLocaleTimeString("es-CO", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  if (f.toDateString() === hoy.toDateString()) return `Hoy, ${hora}`;
  if (f.toDateString() === ayer.toDateString()) return `Ayer, ${hora}`;
  return f.toLocaleDateString("es-CO");
}

/** "06/11/2026, 10:41 p. m." */
export function fechaHoraLarga(iso: string | null | undefined): string {
  if (!iso) return "—";
  const f = new Date(iso);
  return (
    f.toLocaleDateString("es-CO") +
    ", " +
    f.toLocaleTimeString("es-CO", { hour: "numeric", minute: "2-digit", hour12: true })
  );
}

/** "10:41:52 p. m." */
export function horaLarga(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("es-CO", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

/** Documento con separador de miles: "CC 80.412.337". */
export function formatearDocumento(tipo: TipoDocumento, numero: string): string {
  const n = Number(numero.replace(/\D/g, ""));
  const conPuntos = Number.isNaN(n) ? numero : n.toLocaleString("es-CO");
  return `${tipo} ${conPuntos}`;
}

/** Segundos con coma decimal: "2,3 s". */
export function segundos(valor: number | null | undefined): string {
  if (valor == null) return "—";
  return `${valor.toLocaleString("es-CO", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} s`;
}

export const ETIQUETA_ESTADO: Record<EstadoMonitoreo, string> = {
  NORMAL: "Normal",
  PRECAUCION: "Precaución",
  CRITICO: "Crítico",
  SIN_SENAL: "Sin señal",
  SIN_VIAJE: "Sin viaje",
};

export const ETIQUETA_TIPO_EVENTO: Record<TipoEvento, string> = {
  MICROSUENO: "Microsueño",
  ROSTRO_NO_VISIBLE: "Rostro no visible",
};

export const ETIQUETA_TIPO_DOCUMENTO: Record<TipoDocumento, string> = {
  CC: "Cédula de ciudadanía",
  CE: "Cédula de extranjería",
  PASAPORTE: "Pasaporte",
};
