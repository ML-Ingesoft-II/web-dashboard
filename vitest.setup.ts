import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { servidor } from "@/test/servidor";

// El servidor de prueba (MSW) intercepta las peticiones de fetch.
// Si una prueba llama a una ruta sin respuesta definida, falla con error.
beforeAll(() => servidor.listen({ onUnhandledRequest: "error" }));

// Cada prueba empieza limpia: sin respuestas ni espías de la anterior.
afterEach(() => {
  servidor.resetHandlers();
  vi.restoreAllMocks();
});

afterAll(() => servidor.close());
