"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { AuthCard } from "@/components/AuthCard";
import { Aviso } from "@/components/Aviso";
import { api, ApiError } from "@/lib/client";
import { mensajeDeError } from "@/lib/estados";

/** En el login, 401 significa credenciales incorrectas, no sesión vencida. */
function mensajeDeLogin(err: unknown): string {
  if (err instanceof ApiError && err.status === 401) {
    return err.problem.detail || "Correo o contraseña incorrectos.";
  }
  if (err instanceof ApiError && err.status === 403) {
    return err.problem.detail || "Este panel es solo para despachadores.";
  }
  return mensajeDeError(err, "No se pudo iniciar sesión.");
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { motivo?: string };
}) {
  const sesionExpirada = searchParams.motivo === "sesion-expirada";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sinPermiso, setSinPermiso] = useState(false);
  const [cargando, setCargando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      await api("/auth/sesion", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      router.push("/flota");
      router.refresh();
    } catch (err) {
      setSinPermiso(err instanceof ApiError && err.status === 403);
      setError(mensajeDeLogin(err));
      setCargando(false);
    }
  }

  return (
    <AuthCard titulo="Inicia sesión">
      <form onSubmit={enviar} className="space-y-4">
        {sesionExpirada && !error && (
          <Aviso sobreSuperficie>Tu sesión expiró. Vuelve a iniciar sesión.</Aviso>
        )}
        <div>
          <label className="label" htmlFor="email">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="text-right">
          <Link
            href="/recuperar"
            className="text-sm text-primary-text hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {error && (
          <Aviso
            sobreSuperficie
            icono={sinPermiso ? "candado" : "info"}
            titulo={sinPermiso ? "No tienes permiso" : undefined}
          >
            {error}
          </Aviso>
        )}

        <button type="submit" className="btn-primary w-full" disabled={cargando}>
          {cargando ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </AuthCard>
  );
}
