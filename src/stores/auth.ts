import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { supabaseConfigured } from "@/lib/supabase"
import { authService } from "@/services/authService"
import type { Empleado, Rol } from "@/types"
import { CLIENTE_DEMO, esCorreoCliente } from "@/config/clienteDemo"

// Sesión local del rol Cliente (temporal, sin tabla en BD)
const KEY_CLIENTE = "eldiario.cliente.sesion"
type ClienteSesion = { email: string; nombre: string }
function leerCliente(): ClienteSesion | null {
  try { const r = sessionStorage.getItem(KEY_CLIENTE); return r ? JSON.parse(r) : null } catch { return null }
}
function guardarCliente(c: ClienteSesion | null) {
  try { c ? sessionStorage.setItem(KEY_CLIENTE, JSON.stringify(c)) : sessionStorage.removeItem(KEY_CLIENTE) } catch {}
}

export const useAuthStore = defineStore("auth", () => {
  const session = ref<{ user: { id: string } } | null>(null)
  const empleado = ref<Empleado | null>(null)
  const cliente = ref<ClienteSesion | null>(leerCliente())

  const esCliente = computed(() => !!cliente.value)
  const isAuthenticated = computed(() => !!session.value || esCliente.value)
  const rolActual = computed<Rol | "Cliente" | null>(() =>
    cliente.value ? "Cliente" : (empleado.value?.rol ?? null),
  )

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
    // Rol Cliente: acceso con correo específico, sin Supabase
    if (esCorreoCliente(email)) {
      if (password !== CLIENTE_DEMO.password) throw new Error("Credenciales incorrectas.")
      cliente.value = { email: CLIENTE_DEMO.email, nombre: CLIENTE_DEMO.nombre }
      guardarCliente(cliente.value)
      return
    }
    const data = await authService.login({ email, password })
    session.value = data.session
    if (data.user) {
      empleado.value = await authService.getEmpleado(data.user.id)
    }
  }

  async function logout() {
    if (cliente.value) {
      cliente.value = null
      guardarCliente(null)
      return
    }
    await authService.logout()
    session.value = null
    empleado.value = null
  }

  // Compatibilidad mientras no hay Supabase configurado
  function clearSession() { session.value = null; empleado.value = null; cliente.value = null; guardarCliente(null) }

  return { session, empleado, cliente, esCliente, isAuthenticated, rolActual, initSession, login, logout, clearSession }
})
