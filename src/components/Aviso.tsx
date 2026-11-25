import { Icono, type NombreIcono } from "@/components/Icono";

/**
 * Mensaje en bloque con ícono (sesión vencida, error de carga, sin permiso…).
 * Tono neutro: el sistema de diseño reserva el rojo para las alertas críticas.
 * Para cambiar el tono de todos los avisos basta con editar las clases de aquí.
 */
export function Aviso({
  icono = "info",
  titulo,
  children,
  acciones,
  sobreSuperficie = false,
}: {
  icono?: NombreIcono;
  titulo?: string;
  children: React.ReactNode;
  /** Botones opcionales debajo del texto (por ejemplo "Reintentar"). */
  acciones?: React.ReactNode;
  /** true si el aviso va dentro de una tarjeta (usa el fondo para contrastar). */
  sobreSuperficie?: boolean;
}) {
  return (
    <div
      role="status"
      className={`flex gap-3 rounded-control p-4 text-sm text-fg ${
        sobreSuperficie ? "bg-background" : "bg-surface"
      }`}
    >
      <Icono nombre={icono} className="text-primary-text" />
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          {titulo && <p className="font-medium">{titulo}</p>}
          <div className={titulo ? "text-fg-muted" : undefined}>{children}</div>
        </div>
        {acciones && <div className="flex flex-wrap gap-2">{acciones}</div>}
      </div>
    </div>
  );
}
