import { supabase } from "@/lib/supabase"
import type { Seguimiento } from "@/types"

export const seguimientoService = {
  async listarPorProspecto(idProspecto: number) {
    const { data, error } = await supabase
      .from("seguimiento")
      .select("*, empleados(nombre)")
      .eq("id_prospecto", idProspecto)
      .order("fecha_accion", { ascending: false })
    if (error) throw new Error(error.message)
    return data ?? []
  },

  async listarPorEmpleado(idEmpleado: string) {
    const { data, error } = await supabase
      .from("seguimiento")
      .select("*, prospectos(nombre_empresa, nombre_contacto)")
      .eq("id_empleado", idEmpleado)
      .order("fecha_accion", { ascending: false })
    if (error) throw new Error(error.message)
    return data ?? []
  },

  async crear(seguimiento: Omit<Seguimiento, "id" | "created_at" | "fecha_accion">) {
    const { data, error } = await supabase
      .from("seguimiento")
      .insert(seguimiento)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  },

  async actualizar(id: number, cambios: Partial<Omit<Seguimiento, "id" | "created_at">>) {
    const { data, error } = await supabase
      .from("seguimiento")
      .update(cambios)
      .eq("id", id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  },
}
