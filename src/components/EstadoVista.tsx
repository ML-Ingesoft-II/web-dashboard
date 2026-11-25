import { Aviso } from "@/components/Aviso";
import { Icono } from "@/components/Icono";
import { mensajeDeError, type EstadoPantalla } from "@/lib/estados";

/**
 * Muestra el estado de una pantalla o sección que carga datos: cargando,
 * vacío, error (con "Reintentar") o sin permiso (403). Con estado "ok" no
 * pinta nada y la pantalla muestra sus datos.
 */
export function EstadoVista({
  estado,
  error,
  textoVacio,
  textoError,
  onReintentar,
  sobreSuperficie = false,
}: {
  estado: EstadoPantalla;
  error?: unknown;
  /** Por ejemplo "No hay conductores que coincidan con la búsqueda." */
  textoVacio: string;
  /** Título del error, por ejemplo "No se pudo cargar la flota." */
  textoError: string;
  onReintentar?: () => void;
  sobreSuperficie?: boolean;
}) {
  switch (estado) {
    case "ok":
      return null;
    case "cargando":
      return (
        <p role="status" className="py-6 text-center text-sm text-fg-muted">
          Cargando…
        </p>
      );
    case "vacio":
      return <p className="py-6 text-center text-sm text-fg-muted">{textoVacio}</p>;
    case "sinPermiso":
      return (
        <Aviso icono="candado" titulo="No tienes permiso" sobreSuperficie={sobreSuperficie}>
          Tu usuario no tiene permiso para ver esta información. Si crees que es un
          error, consulta con el administrador de tu flota.
        </Aviso>
      );
    case "error":
      return (
        <Aviso
          titulo={textoError}
          sobreSuperficie={sobreSuperficie}
          acciones={
            onReintentar && (
              <button onClick={onReintentar} className="btn-secondary min-h-9 px-3 text-sm">
                <Icono nombre="reintentar" tamano={18} />
                Reintentar
              </button>
            )
          }
        >
          {mensajeDeError(error, "Ocurrió un error inesperado. Intenta de nuevo.")}
        </Aviso>
      );
  }
}

/** Igual que EstadoVista, pero como fila de una tabla (ocupa todas las columnas). */
export function FilaEstado({
  columnas,
  ...props
}: Parameters<typeof EstadoVista>[0] & { columnas: number }) {
  if (props.estado === "ok") return null;
  return (
    <tr>
      <td colSpan={columnas} className="px-5 py-4">
        <EstadoVista {...props} />
      </td>
    </tr>
  );
}
