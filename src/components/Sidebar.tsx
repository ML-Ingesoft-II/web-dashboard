"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Sesion } from "@/lib/api-types";
import { api } from "@/lib/client";
import { useTheme } from "@/lib/useTheme";

const NAV = [
  { href: "/flota", etiqueta: "Estado de la flota", icono: "🚚" },
  { href: "/conductores", etiqueta: "Conductores", icono: "👥" },
  { href: "/historial", etiqueta: "Historial de incidentes", icono: "☰" },
];

export function Sidebar({ sesion }: { sesion: Sesion | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const { esClaro, alternar } = useTheme();

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
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-slate-800 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Tire</h1>
        <p className="text-xs text-slate-400">Panel del despachador</p>
      </div>

      <nav className="space-y-1">
        {NAV.map((item) => {
          const activo = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                activo
                  ? "bg-brand/15 text-brand"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span aria-hidden>{item.icono}</span>
              {item.etiqueta}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-5 pt-6">
        <button
          onClick={alternar}
          className="flex w-full items-center justify-between text-sm text-slate-300"
        >
          <span className="flex items-center gap-2">
            <span aria-hidden>{esClaro ? "🌙" : "☀️"}</span>
            Modo {esClaro ? "oscuro" : "claro"}
          </span>
          <span
            className={`relative h-5 w-10 rounded-full transition ${
              esClaro ? "bg-brand" : "bg-slate-600"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${
                esClaro ? "left-5" : "left-0.5"
              }`}
            />
          </span>
        </button>

        <div className="border-t border-slate-800 pt-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-slate-200">
              {iniciales}
            </span>
            <div className="text-sm">
              <p className="font-semibold text-slate-100">{sesion?.nombre}</p>
              <p className="text-xs text-slate-400">
                Despachadora, {sesion?.nombreFlota}
              </p>
            </div>
          </div>
          <button
            onClick={cerrarSesion}
            className="mt-4 flex items-center gap-2 text-sm text-brand hover:underline"
          >
            <span aria-hidden>⎋</span> Cerrar sesión
          </button>
        </div>
      </div>
    </aside>
  );
}
