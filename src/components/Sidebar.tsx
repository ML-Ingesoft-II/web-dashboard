"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Sesion } from "@/lib/api-types";
import { api } from "@/lib/client";

const NAV = [
  { href: "/flota", etiqueta: "Estado de la flota", icono: "🚚" },
  { href: "/conductores", etiqueta: "Conductores", icono: "👥" },
  { href: "/historial", etiqueta: "Historial de incidentes", icono: "☰" },
];

export function Sidebar({ sesion }: { sesion: Sesion | null }) {
  const pathname = usePathname();
  const router = useRouter();

  async function cerrarSesion() {
    await api("/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const iniciales = (sesion?.nombre ?? "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col gap-7 overflow-y-auto border-r border-border px-4 py-6">
      <div className="flex flex-col gap-0.5 px-3">
        <span className="text-[28px] font-bold leading-8 text-fg">Tire</span>
        <span className="text-sm text-fg-muted">Panel del despachador</span>
      </div>

      <nav aria-label="Menú principal" className="flex flex-col gap-1">
        {NAV.map((item) => {
          const activo = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={activo ? "page" : undefined}
              className={`flex h-11 items-center gap-3 rounded-control px-3 text-[15px] transition ${
                activo
                  ? "bg-surface font-medium text-fg"
                  : "text-fg-muted hover:bg-surface hover:text-fg"
              }`}
            >
              <span aria-hidden>{item.icono}</span>
              {item.etiqueta}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-3 border-t border-border px-3 pt-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-sm font-bold text-fg">
            {iniciales}
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-fg">{sesion?.nombre}</span>
            <span className="text-[13px] text-fg-muted">
              Despachadora, {sesion?.nombreFlota}
            </span>
          </div>
        </div>
        <button
          onClick={cerrarSesion}
          className="flex h-10 items-center gap-2 text-sm text-primary-text hover:underline"
        >
          <span aria-hidden>⎋</span> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
