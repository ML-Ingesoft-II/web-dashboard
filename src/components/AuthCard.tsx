export function AuthCard({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-[420px] rounded-card bg-surface p-10">
        <div className="mb-5 flex flex-col gap-1 text-center">
          <h1 className="text-[40px] font-bold leading-[48px] text-fg">Tire</h1>
          <p className="text-base text-fg-muted">Panel del despachador</p>
        </div>
        <h2 className="mb-5 text-center text-lg font-bold text-fg">{titulo}</h2>
        {children}
      </div>
    </main>
  );
}
