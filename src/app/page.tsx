"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { AuthCard } from "@/components/AuthCard";
import { api, ApiError } from "@/lib/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
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
      const msg =
        err instanceof ApiError
          ? err.problem.detail || "Correo o contraseña incorrectos."
          : "No se pudo iniciar sesión.";
      setError(msg);
      setCargando(false);
    }
  }

  return (
    <AuthCard titulo="Inicia sesión">
      <form onSubmit={enviar} className="space-y-4">
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
            className="text-sm text-brand hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary w-full" disabled={cargando}>
          {cargando ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </AuthCard>
  );
}
