"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ConductorResponse, TipoDocumento } from "@/lib/api-types";
import { api, ApiError } from "@/lib/client";
import { ETIQUETA_TIPO_DOCUMENTO } from "@/lib/format";
import { Icono } from "@/components/Icono";

export interface ConductorFormProps {
  modo: "crear" | "editar";
  id?: string;
  inicial?: ConductorResponse;
}

const TIPOS: TipoDocumento[] = ["CC", "CE", "PASAPORTE"];

export function ConductorForm({ modo, id, inicial }: ConductorFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    nombres: inicial?.nombres ?? "",
    apellidos: inicial?.apellidos ?? "",
    tipoDocumento: (inicial?.tipoDocumento ?? "CC") as TipoDocumento,
    numeroDocumento: inicial?.numeroDocumento ?? "",
    correo: inicial?.correo ?? "",
    telefono: inicial?.telefono ?? "",
    placaVehiculo: inicial?.placaVehiculo ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const set = (campo: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }));

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      const payload = {
        ...form,
        telefono: form.telefono || null,
        placaVehiculo: form.placaVehiculo || null,
      };
      if (modo === "crear") {
        await api("/conductores", { method: "POST", body: JSON.stringify(payload) });
      } else {
        await api(`/conductores/${id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      }
      router.push("/conductores");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.problem.detail || "Revisa los datos del formulario."
          : "No se pudo guardar."
      );
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="card space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Campo etiqueta="Nombres">
          <input className="input" value={form.nombres} onChange={set("nombres")} required />
        </Campo>
        <Campo etiqueta="Apellidos">
          <input className="input" value={form.apellidos} onChange={set("apellidos")} required />
        </Campo>
        <Campo etiqueta="Tipo de documento">
          <select className="input" value={form.tipoDocumento} onChange={set("tipoDocumento")}>
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {ETIQUETA_TIPO_DOCUMENTO[t]}
              </option>
            ))}
          </select>
        </Campo>
        <Campo etiqueta="Número de documento">
          <input
            className="input"
            value={form.numeroDocumento}
            onChange={set("numeroDocumento")}
            required
          />
        </Campo>
        <Campo etiqueta="Correo electrónico">
          <input
            className="input"
            type="email"
            value={form.correo}
            onChange={set("correo")}
            required
          />
        </Campo>
        <Campo etiqueta="Teléfono celular">
          <input className="input" value={form.telefono} onChange={set("telefono")} />
        </Campo>
        <Campo etiqueta="Placa del vehículo asignado">
          <input className="input" value={form.placaVehiculo} onChange={set("placaVehiculo")} />
        </Campo>
      </div>

      {modo === "crear" && (
        <div className="flex gap-3 rounded-control bg-background p-4 text-sm text-fg">
          <Icono nombre="info" className="text-primary-text" />
          <p>
            La contraseña inicial es el primer apellido y los últimos 4 dígitos del
            documento (por ejemplo, Quintero8392). El conductor deberá cambiarla al
            iniciar sesión por primera vez.
          </p>
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-tag-critical-bg px-3 py-2 text-sm text-critical">{error}</p>
      )}

      <div className="flex justify-end gap-3 border-t border-border pt-5">
        <Link href="/conductores" className="btn-secondary">
          Cancelar
        </Link>
        <button type="submit" className="btn-primary" disabled={guardando}>
          {guardando
            ? "Guardando…"
            : modo === "crear"
            ? "Guardar conductor"
            : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}

function Campo({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{etiqueta}</label>
      {children}
    </div>
  );
}
