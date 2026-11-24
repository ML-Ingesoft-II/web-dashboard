import Link from "next/link";
import { ConductorForm } from "@/components/ConductorForm";

export default function NuevoConductorPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <nav className="text-sm text-slate-400">
        <Link href="/conductores" className="text-brand hover:underline">
          Conductores
        </Link>{" "}
        / Registrar conductor
      </nav>
      <header>
        <h1 className="text-2xl font-bold text-white">Registrar conductor</h1>
        <p className="text-sm text-slate-400">
          El conductor entrará a la app con este correo.
        </p>
      </header>
      <ConductorForm modo="crear" />
    </div>
  );
}
