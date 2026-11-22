/**
 * Representacion estilizada de la ubicacion del evento (sin proveedor de mapas
 * externo, como en el wireframe): un lienzo con "calles" y un marcador.
 */
export function MapaUbicacion({
  lugar,
  latitud,
  longitud,
  color = "red",
}: {
  lugar: string;
  latitud: number | null;
  longitud: number | null;
  color?: "red" | "blue";
}) {
  const marcador = color === "red" ? "#ef4444" : "#3b82f6";
  return (
    <div>
      <div className="relative h-64 overflow-hidden rounded-xl bg-slate-800">
        {/* calles */}
        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          <g stroke="#475569" strokeWidth="6" opacity="0.5">
            <line x1="-10" y1="60" x2="400" y2="120" />
            <line x1="-10" y1="200" x2="420" y2="150" />
            <line x1="120" y1="-10" x2="180" y2="300" />
            <line x1="280" y1="-10" x2="250" y2="300" />
          </g>
          <line x1="200" y1="-10" x2="210" y2="300" stroke="#3b82f6" strokeWidth="8" opacity="0.6" />
        </svg>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
          <svg width="34" height="44" viewBox="0 0 24 32">
            <path
              d="M12 0C5.4 0 0 5.4 0 12c0 8 12 20 12 20s12-12 12-20C24 5.4 18.6 0 12 0z"
              fill={marcador}
            />
            <circle cx="12" cy="12" r="5" fill="white" />
          </svg>
        </div>
        <span className="absolute bottom-3 left-3 rounded-lg bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200">
          {lugar}
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Coordenadas:{" "}
        {latitud != null && longitud != null
          ? `${latitud.toFixed(4)}, ${longitud.toFixed(4)}`
          : "No disponible"}
      </p>
    </div>
  );
}
