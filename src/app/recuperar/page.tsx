"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthCard } from "@/components/AuthCard";
import { api } from "@/lib/client";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    try {
      await api("/auth/recuperacion", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    } catch {
      // La respuesta es la misma exista o no el correo (no se revela).
    } finally {
      setEnviado(true);
      setCargando(false);
    }
  }

  return (
    <AuthCard titulo="Olvidé mi contraseña">
      {enviado ? (
        <div className="space-y-5 text-center">
          <p className="text-sm text-fg">
            Si el correo está registrado, te enviamos un enlace para crear una
            nueva contraseña.
          </p>
          <Link href="/" className="block text-sm text-primary-text hover:underline">
            Volver a iniciar sesión
          </Link>
        </div>
      ) : (
        <form onSubmit={enviar} className="space-y-4">
          <p className="text-center text-sm text-fg-muted">
            Escribe tu correo y te enviaremos un enlace para crear una nueva
            contraseña.
          </p>
          <div>
            <label className="label" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="nombre@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={cargando}>
            {cargando ? "Enviando…" : "Enviar enlace"}
          </button>
          <Link
            href="/"
            className="block text-center text-sm text-primary-text hover:underline"
          >
            Volver a iniciar sesión
          </Link>
        </form>
      )}
    </AuthCard>
  );
}
