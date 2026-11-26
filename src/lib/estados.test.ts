import { describe, expect, it } from "vitest";
import { ApiError } from "@/lib/client";
import { estadoDeConsulta, mensajeDeError } from "@/lib/estados";

describe("estadoDeConsulta", () => {
  it("pasa a error cuando falla la red", () => {
    // Arrange: la consulta terminó con un error de conexión (status 0).
    const consulta = {
      isLoading: false,
      isError: true,
      error: new ApiError(0, { title: "Sin conexión" }),
    };

    // Act
    const estado = estadoDeConsulta(consulta, false);

    // Assert
    expect(estado).toBe("error");
  });

  it("pasa a vacío cuando la lista llega sin elementos", () => {
    // Arrange: la consulta respondió bien, pero la lista está vacía.
    const consulta = { isLoading: false, isError: false, error: null };
    const esVacio = true;

    // Act
    const estado = estadoDeConsulta(consulta, esVacio);

    // Assert
    expect(estado).toBe("vacio");
  });

  it("pasa a sin permiso cuando el backend responde 403", () => {
    // Arrange
    const consulta = {
      isLoading: false,
      isError: true,
      error: new ApiError(403, { title: "Forbidden" }),
    };

    // Act
    const estado = estadoDeConsulta(consulta, false);

    // Assert
    expect(estado).toBe("sinPermiso");
  });
});

describe("mensajeDeError", () => {
  it("usa el mensaje de respaldo si el error no viene de la API", () => {
    // Arrange: un error cualquiera de JavaScript, no un ApiError.
    const error = new Error("algo raro");

    // Act
    const mensaje = mensajeDeError(error, "No se pudo cargar la flota.");

    // Assert
    expect(mensaje).toBe("No se pudo cargar la flota.");
  });
});
