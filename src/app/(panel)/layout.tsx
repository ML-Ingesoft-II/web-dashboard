import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { leerSesion } from "@/lib/server/session";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sesion = leerSesion();
  if (!sesion) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar sesion={sesion} />
      <div className="flex-1 overflow-x-hidden px-8 py-8">{children}</div>
    </div>
  );
}
