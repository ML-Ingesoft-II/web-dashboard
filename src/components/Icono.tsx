/**
 * Íconos del sistema de diseño Tire. Los trazos se tomaron de los mockups del
 * Prototipo 1 (Claude Design): línea de 2 px, esquinas redondeadas, 24 × 24.
 * Heredan el color del texto (`currentColor`), así que se pintan con clases
 * como `text-critical`.
 */

const TRAZOS = {
  // Navegación
  flota: (
    <>
      <path d="M2 6h12v10H2z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="6.5" cy="18" r="2" />
      <circle cx="17.5" cy="18" r="2" />
    </>
  ),
  conductores: (
    <>
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21c0-4 3-6 7-6s7 2 7 6" />
      <path d="M16 4.1a4 4 0 0 1 0 7.8" />
      <path d="M22 21c0-3-1.6-5-4-5.8" />
    </>
  ),
  historial: (
    <>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3 6h.01M3 12h.01M3 18h.01" />
    </>
  ),
  salir: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </>
  ),

  // Estados (siempre acompañados de texto)
  normal: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M7.5 12.5l3 3 6-6.5" />
    </>
  ),
  precaucion: (
    <>
      <path d="M12 3.2L1.9 20.5h20.2L12 3.2z" />
      <path d="M12 9.5v5" />
      <path d="M12 17.6v.1" />
    </>
  ),
  critico: (
    <>
      <path d="M8.1 2.5h7.8l5.6 5.6v7.8l-5.6 5.6H8.1l-5.6-5.6V8.1z" />
      <path d="M12 7.5v5.5" />
      <path d="M12 16.4v.1" />
    </>
  ),
  sinSenal: (
    <>
      <path d="M2 8.8a15 15 0 0 1 4.2-2.6M10 5.1A15 15 0 0 1 22 8.8" />
      <path d="M5.3 12.3a10 10 0 0 1 3-1.8M13.6 10.2a10 10 0 0 1 5.1 2.1" />
      <path d="M8.8 15.8a5 5 0 0 1 6.4 0" />
      <path d="M12 19.5v.1" />
      <path d="M3 3l18 18" />
    </>
  ),
  sinViaje: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 9v6M14 9v6" />
    </>
  ),

  // Acciones y apoyo
  anterior: <path d="M15 6l-6 6 6 6" />,
  siguiente: <path d="M9 6l6 6-6 6" />,
  agregar: <path d="M12 5v14M5 12h14" />,
  check: <path d="M5 12l5 5 9-10" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8v.1" />
    </>
  ),
  correo: (
    <>
      <path d="M3 6h18v12H3z" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
} as const;

export type NombreIcono = keyof typeof TRAZOS;

export function Icono({
  nombre,
  tamano = 20,
  className,
}: {
  nombre: NombreIcono;
  tamano?: number;
  className?: string;
}) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className ?? ""}`}
    >
      {TRAZOS[nombre]}
    </svg>
  );
}
