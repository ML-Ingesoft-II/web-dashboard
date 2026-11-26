import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import type { ConductorResponse, Pagina } from "@/lib/api-types";
import {
  api,
  ApiError,
  navegacion,
  RUTA_SESION_EXPIRADA,
} from "@/lib/client";
import { servidor } from "@/test/servidor";

describe("api", () => {
  it("devuelve los datos tal cual cuando el servidor responde 200", async () => {
    // Arrange: el interceptor de red responde 200 con una página de conductores.
    const respuestaEsperada: Pagina<ConductorResponse> = {
      pagina: 0,
      tamano: 10,
      totalElementos: 1,
      totalPaginas: 1,
      contenido: [
        {
          id: "cond-1",
          nombres: "Carlos",
          apellidos: "Pérez",
          nombreCompleto: "Carlos Pérez",
          tipoDocumento: "CC",
          numeroDocumento: "1020304050",
          correo: "cperez@tandinos.co",
          telefono: "3001234567",
          placaVehiculo: "ABC123",
          flotaId: "flota-1",
          activo: true,
          tieneViajeEnCurso: false,
          creadoEn: "2026-11-20T10:00:00Z",
        },
      ],
    };

    servidor.use(
      http.get("/api/conductores", () => HttpResponse.json(respuestaEsperada))
    );

    // Act
    const datos = await api<Pagina<ConductorResponse>>("/conductores");

    // Assert
    expect(datos).toEqual(respuestaEsperada);
  });

  it("lanza ApiError con status 401 y redirige al inicio de sesión", async () => {
    // Arrange: el servidor responde 401 y se espía la navegación para no cambiar de página.
    servidor.use(
      http.get("/api/conductores", () =>
        HttpResponse.json(
          {
            title: "No autorizado",
            status: 401,
            detail: "La sesión ha expirado.",
          },
          { status: 401 }
        )
      )
    );
    const irASpy = vi.spyOn(navegacion, "irA").mockImplementation(() => {});

    // Act
    let errorCapturado: unknown;
    try {
      await api("/conductores");
    } catch (error) {
      errorCapturado = error;
    }

    // Assert
    expect(errorCapturado).toBeInstanceOf(ApiError);
    expect((errorCapturado as ApiError).status).toBe(401);
    expect(irASpy).toHaveBeenCalledOnce();
    expect(irASpy).toHaveBeenCalledWith(RUTA_SESION_EXPIRADA);
    expect(irASpy).toHaveBeenCalledWith("/?motivo=sesion-expirada");
  });
});
