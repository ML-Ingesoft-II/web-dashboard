import { Icono } from "@/components/Icono";

/** Pie de tabla con el texto "Mostrando…" y los botones Anterior / Siguiente. */
export function Paginacion({
  mostrando,
  pagina,
  totalPaginas,
  onCambio,
}: {
  mostrando: string;
  /** Página actual, empezando en 0. */
  pagina: number;
  totalPaginas: number;
  onCambio: (p: number) => void;
}) {
  const boton =
    "inline-flex min-h-8 items-center gap-1 rounded-control px-2 text-sm font-medium text-fg hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-fg-muted">
      <span>{mostrando}</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onCambio(Math.max(0, pagina - 1))}
          disabled={pagina === 0}
          className={boton}
        >
          <Icono nombre="anterior" tamano={18} />
          Anterior
        </button>
        <span className="px-2">
          Página {pagina + 1} de {totalPaginas}
        </span>
        <button
          onClick={() => onCambio(Math.min(totalPaginas - 1, pagina + 1))}
          disabled={pagina >= totalPaginas - 1}
          className={boton}
        >
          Siguiente
          <Icono nombre="siguiente" tamano={18} />
        </button>
      </div>
    </div>
  );
}
