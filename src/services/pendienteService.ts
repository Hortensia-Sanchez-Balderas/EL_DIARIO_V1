import { supabase } from "@/lib/supabase"
import type { Pendiente } from "@/types"

export const pendienteService = {
  async listarPorEmpleado(idEmpleado: string) {
    const { data, error } = await supabase
      .from("pendientes")
      .select("*, prospectos(nombre_empresa), contratos(id, estado)")
      .eq("id_empleado", idEmpleado)
      .order("fecha_limite", { ascending: true, nullsFirst: false })
    if (error) throw new Error(error.message)
    return data ?? []
  },

  async crear(pendiente: Omit<Pendiente, "id" | "created_at">) {
    const { data, error } = await supabase
      .from("pendientes")
      .insert(pendiente)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  },

  async actualizar(id: number, cambios: Partial<Omit<Pendiente, "id" | "created_at">>) {
    const { data, error } = await supabase
      .from("pendientes")
      .update(cambios)
      .eq("id", id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  },

  async marcarCompletado(id: number, completado: boolean) {
    return pendienteService.actualizar(id, { completado })
  },

  async eliminar(id: number) {
    const { error } = await supabase
      .from("pendientes")
      .delete()
      .eq("id", id)
    if (error) throw new Error(error.message)
  },
}
