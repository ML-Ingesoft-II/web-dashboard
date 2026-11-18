"use client";

import { useEffect, useState } from "react";

type Tema = "dark" | "light";

/**
 * Tema del panel (oscuro por defecto, como el wireframe). Persiste en
 * localStorage y alterna la clase `light` en <html>.
 */
export function useTheme() {
  const [tema, setTema] = useState<Tema>("dark");

  useEffect(() => {
    const guardado = (localStorage.getItem("tire-tema") as Tema) || "dark";
    setTema(guardado);
    document.documentElement.classList.toggle("light", guardado === "light");
  }, []);

  const alternar = () => {
    setTema((actual) => {
      const nuevo: Tema = actual === "dark" ? "light" : "dark";
      localStorage.setItem("tire-tema", nuevo);
      document.documentElement.classList.toggle("light", nuevo === "light");
      return nuevo;
    });
  };

  return { tema, alternar, esClaro: tema === "light" };
}
