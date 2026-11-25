import Link from "next/link";
import { ConductorForm } from "@/components/ConductorForm";

export default function NuevoConductorPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <nav className="text-sm text-fg-muted">
        <Link href="/conductores" className="text-primary-text hover:underline">
          Conductores
        </Link>{" "}
        / Registrar conductor
      </nav>
      <header>
        <h1 className="text-2xl font-bold text-fg">Registrar conductor</h1>
        <p className="text-sm text-fg-muted">
          El conductor entrará a la app con este correo.
        </p>
      </header>
      <ConductorForm modo="crear" />
    </div>
  );
}
