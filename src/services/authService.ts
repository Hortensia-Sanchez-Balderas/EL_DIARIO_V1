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

    const { data: userData, error: userError } = await client.auth.getUser()

    if (userError || !userData.user) {
      throw new Error("No se pudo validar el usuario autenticado.")
    }

    if (userData.user.id !== authUserId) {
      throw new Error("El usuario autenticado no coincide con la sesión.")
    }

    const { data, error } = await client
      .from("empleados")
      .select("*")
      .eq("auth_id", authUserId)
      .maybeSingle()

    if (error) throw new Error(error.message)

    if (!data) {
      throw new Error(
        "La cuenta no está vinculada correctamente a un empleado. Contacta al administrador del sistema."
      )
    }

    return data
  },

  onAuthStateChange(callback: Parameters<NonNullable<typeof supabase>["auth"]["onAuthStateChange"]>[0]) {
    if (!supabaseConfigured || !supabase) return { data: { subscription: { unsubscribe: () => { } } } }
    return supabase.auth.onAuthStateChange(callback)
  },
}
