import { describe, expect, it } from "vitest";
import { respuestaDeFalla } from "@/lib/server/fallas";

/** Error con la misma forma que lanza fetch (undici) en Node. */
function errorDeFetch(codigo: string): TypeError {
  const error = new TypeError("fetch failed");
  (error as { cause?: unknown }).cause = Object.assign(new Error(codigo), { code: codigo });
  return error;
}

describe("respuestaDeFalla", () => {
  it("responde 504 y avisa que el cambio pudo guardarse cuando se agota la espera", () => {
    // Arrange: el backend recibió la petición pero no envió respuesta a tiempo
    // (caso encontrado con el depurador: el backend detenido en un breakpoint).
    const error = errorDeFetch("UND_ERR_HEADERS_TIMEOUT");

    // Act
    const respuesta = respuestaDeFalla(error);

    // Assert
    expect(respuesta.status).toBe(504);
    expect(respuesta.body).toMatchObject({
      detail: expect.stringContaining("sí se haya guardado"),
    });
  });

  it("responde 503 cuando no hay conexión con el backend", () => {
    // Arrange: el backend está apagado.
    const error = errorDeFetch("ECONNREFUSED");

    // Act
    const respuesta = respuestaDeFalla(error);

    // Assert
    expect(respuesta.status).toBe(503);
  });
});
