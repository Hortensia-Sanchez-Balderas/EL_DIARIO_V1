import { supabase } from "@/lib/supabase"

export const paqueteService = {
  async listarTodos() {
    const { data, error } = await supabase
      .from("paquetes_tarifas")
      .select("*, productos_servicios(nombre_servicio)")
      .order("tarifa_sin_iva", { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
  },

  async listarPorNombreServicio(nombreServicio: string) {
    const { data: svcs } = await supabase
      .from("productos_servicios")
      .select("id")
      .ilike("nombre_servicio", `%${nombreServicio}%`)
    if (!svcs || svcs.length === 0) return []
    const ids = svcs.map((s: any) => s.id)
    const { data, error } = await supabase
      .from("paquetes_tarifas")
      .select("*")
      .in("id_servicio", ids)
      .order("tarifa_sin_iva", { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
  },

  async listarPorServicio(idServicio: number) {
    const { data, error } = await supabase
      .from("paquetes_tarifas")
      .select("*")
      .eq("id_servicio", idServicio)
      .order("tarifa_sin_iva", { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
  },
}
