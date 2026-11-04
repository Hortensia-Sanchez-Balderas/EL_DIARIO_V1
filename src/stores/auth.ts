
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

  const isAuthenticated = computed(() => !!session.value)
  const rolActual = computed(() => empleado.value?.rol ?? null)

  async function initSession() {
    if (!supabaseConfigured || inicializada) return

    inicializada = true

    try {
      const respuesta = authService.onAuthStateChange(
        (_evento, nuevaSesion) => {
          actualizarSesion(nuevaSesion)
        }
      )

      suscripcionAuth =
        respuesta.data.subscription

      // La suscripción puede emitir un cambio mientras se consulta
      // la sesión actual. No dejamos que esta consulta la sobrescriba.
      const cargaInicial = cargaEmpleadoId
      const sesionActual = await authService.getSession()

      if (cargaEmpleadoId !== cargaInicial) return

      actualizarSesion(sesionActual)
    } catch (error) {
      inicializada = false
      limpiarEstado()

      console.error(
        "[EL DIARIO] No se pudo inicializar la sesión:",
        error
      )
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

    if (!data.session || !data.user) {
      limpiarEstado()
      throw new Error("No se recibió una sesión válida.")
    }

    // El listener también recibe este cambio de autenticación.
    // Actualizamos el estado de forma inmediata para evitar
    // mostrar los datos del usuario anterior.
    const cargaId = ++cargaEmpleadoId

    session.value = data.session
    empleado.value = null

    try {
      const empleadoCargado = await authService.getEmpleado(
        data.user.id
      )

      if (
        cargaId === cargaEmpleadoId &&
        session.value?.user?.id === data.user.id
      ) {
        empleado.value = empleadoCargado
      }
    } catch (error) {
      if (
        cargaId === cargaEmpleadoId &&
        session.value?.user?.id === data.user.id
      ) {
        empleado.value = null
      }

      throw error
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
