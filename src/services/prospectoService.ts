import { supabase } from "@/lib/supabase"
import type { Prospecto } from "@/types"

export const prospectoService = {
  async listar() {
    const { data, error } = await supabase
      .from("prospectos")
      .select("*, empleados(nombre)")
      .order("fecha_registro", { ascending: false })
    if (error) throw new Error(error.message)
    return data ?? []
  },

  async listarPorEmpleado(idEmpleado: string) {
    const { data, error } = await supabase
      .from("prospectos")
      .select("*")
      .eq("id_empleado_registro", idEmpleado)
      .order("fecha_registro", { ascending: false })
    if (error) throw new Error(error.message)
    return data ?? []
  },

  async obtener(id: number) {
    const { data, error } = await supabase
      .from("prospectos")
      .select("*, empleados(nombre)")
      .eq("id", id)
      .single()
    if (error) throw new Error(error.message)
    return data
  },

  async crear(prospecto: Omit<Prospecto, "id" | "fecha_registro">) {
    const { data, error } = await supabase
      .from("prospectos")
      .insert(prospecto)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  },

  async actualizar(id: number, cambios: Partial<Omit<Prospecto, "id" | "fecha_registro">>) {
    const { data, error } = await supabase
      .from("prospectos")
      .update(cambios)
      .eq("id", id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  },

  async eliminar(id: number) {
    const { error } = await supabase
      .from("prospectos")
      .delete()
      .eq("id", id)
    if (error) throw new Error(error.message)
  },
}
