"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthCard } from "@/components/AuthCard";
import { api, ApiError } from "@/lib/client";
import { Aviso } from "@/components/Aviso";
import { Icono } from "@/components/Icono";

function Regla({ ok, texto }: { ok: boolean; texto: string }) {
  return (
    <p className={`flex items-center gap-2 text-sm ${ok ? "text-normal" : "text-fg-muted"}`}>
      {/* El check solo aparece cuando la regla se cumple; el espacio se reserva igual. */}
      <span className="flex h-[18px] w-[18px] items-center justify-center">
        {ok && <Icono nombre="check" tamano={18} />}
      </span>
      {texto}
    </p>
  );
}

function Formulario() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const tieneLargo = password.length >= 8;
  const tieneNumero = /\d/.test(password);
  const coincide = password.length > 0 && password === confirmar;
  const valido = tieneLargo && tieneNumero && coincide;

  // Barra de fuerza simple (0-2 segmentos).
  const fuerza = (tieneLargo ? 1 : 0) + (tieneNumero ? 1 : 0);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!valido) return;
    setError(null);
    setCargando(true);
    try {
      await api("/auth/recuperacion/confirmar", {
        method: "POST",
        body: JSON.stringify({ token, passwordNueva: password }),
      });
      router.push("/");
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.problem.detail || "El enlace venció. Solicita uno nuevo."
          : "No se pudo cambiar la contraseña.";
      setError(msg);
      setCargando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-4">
      <div>
        <label className="label" htmlFor="password">
          Nueva contraseña
        </label>
        <input
          id="password"
          type="password"
          className="input"
          placeholder="Escribe tu nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="mt-2 flex gap-1.5">
          {[0, 1].map((i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i < fuerza ? "bg-normal" : "bg-border"
              }`}
            />
          ))}
        </div>
        <div className="mt-2 space-y-1">
          <Regla ok={tieneLargo} texto="Mínimo 8 caracteres" />
          <Regla ok={tieneNumero} texto="Incluye al menos un número" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="confirmar">
          Confirmar contraseña
        </label>
        <input
          id="confirmar"
          type="password"
          className="input"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          required
        />
      </div>

      {error && (
        <Aviso sobreSuperficie>{error}</Aviso>
      )}

      <button
        type="submit"
        className="btn-primary w-full"
        disabled={cargando || !valido}
      >
        {cargando ? "Guardando…" : "Guardar contraseña"}
      </button>
    </form>
  );
}

export default function DefinirPasswordPage() {
  return (
    <AuthCard titulo="Define tu nueva contraseña">
      <Suspense fallback={null}>
        <Formulario />
      </Suspense>
    </AuthCard>
  );
}
