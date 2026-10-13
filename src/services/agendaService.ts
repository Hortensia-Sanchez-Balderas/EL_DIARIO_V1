import { supabase } from "@/lib/supabase"
import type { AgendaEvento } from "@/types"

export const agendaService = {
  async listarPorEmpleado(idEmpleado: string) {
    const { data, error } = await supabase
      .from("agenda_eventos")
      .select("*, prospectos(nombre_empresa, nombre_contacto)")
      .eq("id_empleado", idEmpleado)
      .order("fecha", { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
  },

  async listarRango(idEmpleado: string, desde: string, hasta: string) {
    const { data, error } = await supabase
      .from("agenda_eventos")
      .select("*, prospectos(nombre_empresa, nombre_contacto)")
      .eq("id_empleado", idEmpleado)
      .gte("fecha", desde)
      .lte("fecha", hasta)
      .order("fecha", { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
  },

  async crear(evento: Omit<AgendaEvento, "id" | "created_at">) {
    const { data, error } = await supabase
      .from("agenda_eventos")
      .insert(evento)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  },

  async actualizar(id: number, cambios: Partial<Omit<AgendaEvento, "id" | "created_at">>) {
    const { data, error } = await supabase
      .from("agenda_eventos")
      .update(cambios)
      .eq("id", id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  },

  async eliminar(id: number) {
    const { error } = await supabase
      .from("agenda_eventos")
      .delete()
      .eq("id", id)
    if (error) throw new Error(error.message)
  },

  async marcarCompletado(id: number, completado: boolean) {
    return agendaService.actualizar(id, { completado })
  },
}
