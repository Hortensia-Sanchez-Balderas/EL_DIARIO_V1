import { supabase } from "@/lib/supabase"
import type { Empleado } from "@/types"

export const empleadoService = {
  async listar() {
    const { data, error } = await supabase
      .from("empleados")
      .select("*")
      .order("nombre", { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
  },

  async listarActivos() {
    const { data, error } = await supabase
      .from("empleados")
      .select("*")
      .eq("activo", true)
      .order("nombre", { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
  },

  async obtener(id: string) {
    const { data, error } = await supabase
      .from("empleados")
      .select("*")
      .eq("id", id)
      .single()
    if (error) throw new Error(error.message)
    return data
  },

  async actualizar(id: string, cambios: Partial<Omit<Empleado, "id" | "created_at">>) {
    const { data, error } = await supabase
      .from("empleados")
      .update(cambios)
      .eq("id", id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  },

  async desactivar(id: string) {
    return empleadoService.actualizar(id, { activo: false })
  },
}
