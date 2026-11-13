
import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { Session } from "@supabase/supabase-js"
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
  const esCliente = computed(() => cliente.value !== null)
  let inicializada = false
  let suscripcionAuth: { unsubscribe: () => void } | null = null
  let cargaEmpleadoId = 0
  let cargaActual: { usuarioId: string; promesa: Promise<void> } | null = null

  const isAuthenticated = computed(() => !!session.value || esCliente.value)
  const rolActual = computed<Rol | "Cliente" | null>(() => esCliente.value ? "Cliente" : empleado.value?.rol ?? null)

  function limpiarEstado() {
    cargaEmpleadoId++
    cargaActual = null
    session.value = null
    empleado.value = null
    cliente.value = null
    guardarCliente(null)
  }

  function actualizarSesion(nuevaSesion: Session | null): Promise<void> {
    if (!nuevaSesion) {
      // Un evento inicial sin sesión de Supabase no debe borrar la sesión local del cliente.
      cargaEmpleadoId++
      cargaActual = null
      session.value = null
      empleado.value = null
      return Promise.resolve()
    }
    const usuarioId = nuevaSesion.user.id
    if (session.value?.user.id === usuarioId && cargaActual?.usuarioId === usuarioId) {
      session.value = nuevaSesion
      return cargaActual.promesa
    }
    if (session.value?.user.id === usuarioId && empleado.value) {
      session.value = nuevaSesion
      return Promise.resolve()
    }
    const cargaId = ++cargaEmpleadoId
    session.value = nuevaSesion
    empleado.value = null
    // La consulta ocurre después del callback de Supabase para evitar bloquear Auth.
    const promesa = new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        authService.getEmpleado(usuarioId).then((resultado) => {
          if (cargaId === cargaEmpleadoId && session.value?.user.id === usuarioId) empleado.value = resultado
          resolve()
        }).catch((error) => {
          if (cargaId === cargaEmpleadoId) empleado.value = null
          reject(error)
        })
      }, 0)
    })
    cargaActual = { usuarioId, promesa }
    void promesa.then(() => { if (cargaActual?.promesa === promesa) cargaActual = null }, () => { if (cargaActual?.promesa === promesa) cargaActual = null })
    return promesa
  }

  async function initSession() {
    if (!supabaseConfigured || inicializada) return

    inicializada = true

    try {
      const respuesta = authService.onAuthStateChange(
        async (_evento, nuevaSesion) => {
          void actualizarSesion(nuevaSesion).catch((error) => console.error("[EL DIARIO] No se pudo cargar el empleado:", error))
        }
      )

      suscripcionAuth =
        respuesta.data.subscription

      // La suscripción puede emitir un cambio mientras se consulta
      // la sesión actual. No dejamos que esta consulta la sobrescriba.
      const cargaInicial = cargaEmpleadoId
      const sesionActual = await authService.getSession()

      if (cargaEmpleadoId !== cargaInicial) return

      await actualizarSesion(sesionActual)
    } catch (error) {
      inicializada = false
      suscripcionAuth?.unsubscribe()
      suscripcionAuth = null
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

    cliente.value = null
    guardarCliente(null)
    await actualizarSesion(data.session)
  }

  async function logout() {
    if (!esCliente.value) await authService.logout()
    limpiarEstado()
  }

  // Compatibilidad mientras no hay Supabase configurado
  function clearSession() { limpiarEstado() }

  return { session, empleado, cliente, esCliente, isAuthenticated, rolActual, initSession, login, logout, clearSession }
})
