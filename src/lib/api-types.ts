// Tipos del contrato OpenAPI v1.1.0 del backend Tire usados por el panel.

export type RolUsuario = "CONDUCTOR" | "DESPACHADOR";
export type NivelAlerta = "NORMAL" | "PRECAUCION" | "CRITICO";
export type EstadoMonitoreo =
  | "NORMAL"
  | "PRECAUCION"
  | "CRITICO"
  | "SIN_SENAL"
  | "SIN_VIAJE";
export type TipoEvento = "MICROSUENO" | "ROSTRO_NO_VISIBLE";
export type TipoDocumento = "CC" | "CE" | "PASAPORTE";
export type EstadoViaje = "EN_CURSO" | "FINALIZADO";
export type AtencionEvento = "NO_REQUIERE" | "SIN_ATENDER" | "ATENDIDA";

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tipo: string;
  expiracionSegundos: number;
  rol: RolUsuario;
  usuarioId: string;
  nombre: string;
  flotaId: string | null;
  nombreFlota: string | null;
  debeCambiarPassword: boolean;
}

/** Datos de sesion que el cliente guarda (sin los tokens, que van en cookie httpOnly). */
export interface Sesion {
  usuarioId: string;
  nombre: string;
  rol: RolUsuario;
  flotaId: string | null;
  nombreFlota: string | null;
  debeCambiarPassword: boolean;
}

export interface ConductorResumen {
  id: string;
  nombreCompleto: string;
  placaVehiculo: string | null;
  telefono: string | null;
}

export interface UsuarioResumen {
  id: string;
  nombre: string;
}

export interface Pagina<T> {
  pagina: number;
  tamano: number;
  totalElementos: number;
  totalPaginas: number;
  contenido: T[];
}

export interface ConductorResponse {
  id: string;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  correo: string;
  telefono: string | null;
  placaVehiculo: string | null;
  flotaId: string;
  activo: boolean;
  tieneViajeEnCurso: boolean;
  creadoEn: string;
}

export interface ConductorEnViaje {
  conductor: ConductorResumen;
  viajeId: string;
  estado: EstadoMonitoreo;
  nivelAlerta: NivelAlerta;
  fechaInicio: string;
  ultimaSenalEn: string | null;
  ultimaLatitud: number | null;
  ultimaLongitud: number | null;
  velocidadKmh: number | null;
  alertaAbiertaId: string | null;
}

export interface ConductorSinViaje {
  conductor: ConductorResumen;
  fechaUltimoViaje: string | null;
}

export interface EstadoFlotaResponse {
  actualizadoEn: string;
  conteoPorEstado: Partial<Record<EstadoMonitoreo, number>>;
  conductoresEnViaje: ConductorEnViaje[];
  conductoresSinViaje: ConductorSinViaje[];
}

export interface AlertaResponse {
  id: string;
  viajeId: string;
  eventoId: string;
  conductor: ConductorResumen;
  tipoEvento: TipoEvento;
  duracionSegundos: number;
  fechaEvento: string;
  fechaApertura: string;
  latitud: number | null;
  longitud: number | null;
  atendida: boolean;
  fechaAtencion: string | null;
  atendidaPor: UsuarioResumen | null;
  notasDespachador: string | null;
}

export type EntradaLineaTiempoTipo =
  | "DETECTADO"
  | "ALARMA_ACTIVADA"
  | "ALARMA_INTENSIFICADA"
  | "ALERTA_ENVIADA"
  | "CONDUCTOR_CONFIRMO"
  | "ATENDIDA";

export interface EntradaLineaTiempo {
  fechaHora: string;
  tipo: EntradaLineaTiempoTipo;
  descripcion: string;
}

export interface AlertaDetalleResponse extends AlertaResponse {
  fechaInicioViaje: string;
  ultimaSenalEn: string | null;
  lineaTiempo: EntradaLineaTiempo[];
}

export interface RespuestaConductor {
  tipo: "RESPONDIO" | "NO_RESPONDIO" | "VOLVIO_A_CAMARA";
  segundos: number | null;
}

export interface EventoHistorial {
  id: string;
  viajeId: string;
  tipoEvento: TipoEvento;
  fechaHora: string;
  duracionSegundos: number;
  respuesta: RespuestaConductor;
  confirmado: boolean;
  latitud: number | null;
  longitud: number | null;
  alertaId: string | null;
  conductor: ConductorResumen;
  atencion: AtencionEvento;
}

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errors?: { field: string; message: string }[];
}
