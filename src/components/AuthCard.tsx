export function AuthCard({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
        <h1 className="text-center text-4xl font-bold text-white">Tire</h1>
        <p className="mb-6 text-center text-sm text-slate-400">
          Panel del despachador
        </p>
        <h2 className="mb-5 text-center text-lg font-semibold text-slate-100">
          {titulo}
        </h2>
        {children}
      </div>
    </main>
  );
}
