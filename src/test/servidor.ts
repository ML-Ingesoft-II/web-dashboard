import { setupServer } from "msw/node";

/**
 * Servidor HTTP de prueba (interceptor de red con MSW).
 * Cada prueba define sus respuestas con `servidor.use(http.get(...))`.
 */
export const servidor = setupServer();
