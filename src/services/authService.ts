import { supabase, supabaseConfigured } from "@/lib/supabase"
import type { LoginRequest } from "@/types"

function requireSupabase() {
  if (!supabaseConfigured || !supabase) {
    throw new Error("Supabase no configurado. Agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env.local")
  }
  return supabase
}

export const authService = {
  async login({ email, password }: LoginRequest) {
    const client = requireSupabase()
    const { data, error } = await client.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    return data
  },

  async logout() {
    const client = requireSupabase()
    const { error } = await client.auth.signOut()
    if (error) throw new Error(error.message)
  },

  async getSession() {
    if (!supabaseConfigured || !supabase) return null
    try {
      const { data } = await supabase.auth.getSession()
      return data.session
    } catch {
      return null
    }
  },

  // Busca el empleado por auth_id; si no coincide, sincroniza y busca por email
  async getEmpleado(authUserId: string) {
    const client = requireSupabase()

    // 1. Intento principal: buscar por auth_id
    const { data, error } = await client
      .from("empleados")
      .select("*")
      .eq("auth_id", authUserId)
      .maybeSingle()
    if (error) throw new Error(error.message)
    if (data) return data

    // 2. Fallback: obtener email del usuario en auth y buscar por email
    const { data: userData } = await client.auth.getUser()
    const email = userData?.user?.email
    if (!email) throw new Error("No se pudo obtener el email del usuario autenticado.")

    const { data: porEmail, error: err2 } = await client
      .from("empleados")
      .select("*")
      .eq("email", email)
      .maybeSingle()
    if (err2) throw new Error(err2.message)
    if (!porEmail) throw new Error(`No existe un empleado con email ${email}. Verifica que el usuario esté registrado en la tabla empleados.`)

    // 3. Sincronizar auth_id para evitar el fallback en próximos logins
    await client.from("empleados").update({ auth_id: authUserId }).eq("email", email)

    return porEmail
  },

  onAuthStateChange(callback: Parameters<NonNullable<typeof supabase>["auth"]["onAuthStateChange"]>[0]) {
    if (!supabaseConfigured || !supabase) return { data: { subscription: { unsubscribe: () => {} } } }
    return supabase.auth.onAuthStateChange(callback)
  },
}
