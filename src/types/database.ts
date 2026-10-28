// Tipos TypeScript para el schema de Supabase
// Tablas en snake_case, reflejan exactamente el DDL aplicado en Supabase

// ── Enums ──────────────────────────────────────────────────────────────────

export type Rol = "Vendedor" | "Gerente" | "Administrador"
export type EstadoProspecto = "Prospecto" | "Cliente" | "Baja"
export type EstadoContrato = "Firmado" | "Vigente" | "Terminado" | "Cancelado"
export type TipoEvento = "Llamada" | "Visita" | "Reunion" | "Seguimiento" | "Otro"
export type Prioridad = "Alta" | "Media" | "Baja"

// ── Entidades ──────────────────────────────────────────────────────────────

export interface Empleado {
  id: string                        // UUID, gen_random_uuid()
  auth_id: string | null            // vinculado a auth.users
  nombre: string
  email: string
  rol: Rol
  fecha_contratacion: string | null // DATE → "YYYY-MM-DD"
  activo: boolean
  created_at: string
}

export interface ProductoServicio {
  id: number
  nombre_servicio: string
}

export interface Prospecto {
  id: number
  nombre_empresa: string
  nombre_contacto: string
  cargo_contacto: string | null
  telefono: string | null
  email_contacto: string | null
  pagina_web: string | null
  domicilio: string | null
  estado: EstadoProspecto
  id_empleado_registro: string | null  // UUID → empleados.id
  fecha_registro: string
}

export interface PaqueteTarifa {
  id: number
  id_servicio: number
  pln: string
  descripcion: string | null
  medidas_ejemplos: string | null
  tarifa_sin_iva: number
}

export interface Contrato {
  id: number
  id_prospecto: number
  id_empleado_responsable: string      // UUID
  fecha_contrato: string               // DATE
  fecha_inicio_publicacion: string | null
  fecha_fin_publicacion: string | null
  observaciones: string | null
  sub_total: number | null
  iva_monto: number | null
  total: number
  estado: EstadoContrato
  created_at: string
}

export interface ContratoDetalle {
  id: number
  id_contrato: number
  id_paquete: number
  cantidad: number
  precio_unitario: number
  importe: number
}


export interface AgendaEvento {
  id: number
  id_empleado: string
  id_prospecto: number | null
  titulo: string
  descripcion: string | null
  fecha: string
  hora_inicio: string | null
  hora_fin: string | null
  tipo: TipoEvento
  color: string
  completado: boolean
  recordatorio_activo: boolean
  recordatorio_minutos: number
  recordatorio_disparado: boolean
  recordatorio_atendido: boolean
  created_at: string
}

export interface Seguimiento {
  id: number
  id_prospecto: number
  id_empleado: string              // UUID
  tipo_accion: string              // 'Llamada','Email','Visita','Reunion'
  descripcion: string | null
  resultado: string | null
  fecha_accion: string
  proxima_accion: string | null    // DATE
  created_at: string
}

export interface Pendiente {
  id: number
  id_empleado: string              // UUID
  id_prospecto: number | null
  id_contrato: number | null
  titulo: string
  descripcion: string | null
  prioridad: Prioridad
  completado: boolean
  fecha_limite: string | null      // DATE
  created_at: string
}

export interface ActividadLog {
  id: number
  id_empleado: string              // UUID
  tipo_actividad: string
  descripcion: string | null
  fecha_hora: string
}

// ── Tipos con joins frecuentes ─────────────────────────────────────────────

export interface ProspectoConEmpleado extends Prospecto {
  empleado?: Pick<Empleado, "id" | "nombre">
}

export interface ContratoCompleto extends Contrato {
  prospecto?: Pick<Prospecto, "id" | "nombre_empresa" | "nombre_contacto">
  empleado?: Pick<Empleado, "id" | "nombre">
  detalles?: (ContratoDetalle & { paquete?: PaqueteTarifa })[]
}

export interface AgendaEventoConProspecto extends AgendaEvento {
  prospecto?: Pick<Prospecto, "id" | "nombre_empresa" | "nombre_contacto"> | null
}

export interface SeguimientoConProspecto extends Seguimiento {
  prospecto?: Pick<Prospecto, "id" | "nombre_empresa" | "nombre_contacto">
}

// ── Database (para createClient<Database>) ────────────────────────────────

export interface Database {
  public: {
    Tables: {
      empleados: {
        Row: Empleado
        Insert: Omit<Empleado, "id" | "created_at"> & { id?: string; created_at?: string }
        Update: Partial<Omit<Empleado, "id">>
      }
      productos_servicios: {
        Row: ProductoServicio
        Insert: Omit<ProductoServicio, "id">
        Update: Partial<Omit<ProductoServicio, "id">>
      }
      prospectos: {
        Row: Prospecto
        Insert: Omit<Prospecto, "id" | "fecha_registro"> & { fecha_registro?: string }
        Update: Partial<Omit<Prospecto, "id">>
      }
      paquetes_tarifas: {
        Row: PaqueteTarifa
        Insert: Omit<PaqueteTarifa, "id">
        Update: Partial<Omit<PaqueteTarifa, "id">>
      }
      contratos: {
        Row: Contrato
        Insert: Omit<Contrato, "id" | "created_at"> & { created_at?: string }
        Update: Partial<Omit<Contrato, "id">>
      }
      contrato_detalles: {
        Row: ContratoDetalle
        Insert: Omit<ContratoDetalle, "id">
        Update: Partial<Omit<ContratoDetalle, "id">>
      }
      agenda_eventos: {
  Row: AgendaEvento
  Insert: Omit<AgendaEvento, "id" | "created_at"> & {
    created_at?: string
  }
  Update: Partial<Omit<AgendaEvento, "id">>
}
      seguimiento: {
        Row: Seguimiento
        Insert: Omit<Seguimiento, "id" | "created_at" | "fecha_accion"> & { created_at?: string; fecha_accion?: string }
        Update: Partial<Omit<Seguimiento, "id">>
      }
      pendientes: {
        Row: Pendiente
        Insert: Omit<Pendiente, "id" | "created_at"> & { created_at?: string }
        Update: Partial<Omit<Pendiente, "id">>
      }
      actividad_log: {
        Row: ActividadLog
        Insert: Omit<ActividadLog, "id" | "fecha_hora"> & { fecha_hora?: string }
        Update: never
      }
    }
    Functions: {
      crear_contrato_con_detalles: {
        Args: {
          p_contrato: Omit<Contrato, "id" | "created_at">
          p_detalles: Omit<ContratoDetalle, "id" | "id_contrato">[]
        }
        Returns: { contrato_id: number }[]
      }
    }
  }
}
