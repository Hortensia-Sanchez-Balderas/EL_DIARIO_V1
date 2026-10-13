import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { supabaseConfigured } from "@/lib/supabase"
import { authService } from "@/services/authService"
import type { Empleado } from "@/types"

export const useAuthStore = defineStore("auth", () => {
  const session = ref<{ user: { id: string } } | null>(null)
  const empleado = ref<Empleado | null>(null)

  const isAuthenticated = computed(() => !!session.value)
  const rolActual = computed(() => empleado.value?.rol ?? null)

  async function initSession() {
    if (!supabaseConfigured) return
    try {
      const timeout = new Promise<null>((r) => setTimeout(() => r(null), 5000))
      const resultado = await Promise.race([authService.getSession(), timeout])
      const s = resultado as Awaited<ReturnType<typeof authService.getSession>> | null
      session.value = s
      if (s?.user) {
        try { empleado.value = await authService.getEmpleado(s.user.id) } catch {}
      }
      authService.onAuthStateChange(async (_, s) => {
        session.value = s
        if (s?.user) {
          try { empleado.value = await authService.getEmpleado(s.user.id) } catch { empleado.value = null }
        } else {
          empleado.value = null
        }
      })
    } catch (e) {
      console.warn("[EL DIARIO] initSession falló:", e)
    }
  }

  async function login(email: string, password: string) {
    const data = await authService.login({ email, password })
    session.value = data.session
    if (data.user) {
      empleado.value = await authService.getEmpleado(data.user.id)
    }
  }

  async function logout() {
    await authService.logout()
    session.value = null
    empleado.value = null
  }

  // Compatibilidad mientras no hay Supabase configurado
  function clearSession() { session.value = null; empleado.value = null }

  return { session, empleado, isAuthenticated, rolActual, initSession, login, logout, clearSession }
})
