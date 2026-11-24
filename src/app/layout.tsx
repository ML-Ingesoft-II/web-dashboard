import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Tire — Panel del despachador",
  description: "Panel web del despachador del sistema Tire.",
};

// Aplica el tema guardado antes del primer render para evitar parpadeo.
const scriptTema = `
try {
  var t = localStorage.getItem('tire-tema');
  if (t === 'light') document.documentElement.classList.add('light');
} catch (e) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
