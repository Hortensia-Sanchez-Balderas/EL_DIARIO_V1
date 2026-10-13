// Re-exporta los tipos centrales para acceso fácil en toda la app
export type { Rol, EstadoProspecto, EstadoContrato, TipoEvento, Prioridad } from "./database"
export type {
  Empleado,
  Prospecto,
  ProductoServicio,
  PaqueteTarifa,
  Contrato,
  ContratoDetalle,
  AgendaEvento,
  Seguimiento,
  Pendiente,
  ActividadLog,
  ProspectoConEmpleado,
  ContratoCompleto,
  AgendaEventoConProspecto,
  SeguimientoConProspecto,
} from "./database"

// Tipos de UI / formularios
export interface LoginRequest {
  email: string
  password: string
}
