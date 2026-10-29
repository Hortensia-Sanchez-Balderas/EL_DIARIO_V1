
import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { supabaseConfigured } from "@/lib/supabase"
import { authService } from "@/services/authService"
import type { Empleado } from "@/types"

export const useAuthStore = defineStore("auth", () => {
  const session = ref<{ user: { id: string } } | null>(null)
  const empleado = ref<Empleado | null>(null)

  let cargaEmpleadoId = 0
  let inicializada = false

  let suscripcionAuth:
    | { unsubscribe: () => void }
    | null = null

  const isAuthenticated = computed(() => !!session.value)
  const rolActual = computed(() => empleado.value?.rol ?? null)

  function limpiarEstado() {
    cargaEmpleadoId++
    session.value = null
    empleado.value = null
  }

  async function cargarEmpleado(userId: string, cargaId: number) {
    try {
      const empleadoCargado = await authService.getEmpleado(userId)

      // Ignora respuestas de sesiones anteriores.
      if (
        cargaId !== cargaEmpleadoId ||
        session.value?.user?.id !== userId
      ) {
        return
      }

      empleado.value = empleadoCargado
    } catch (error) {
      if (
        cargaId === cargaEmpleadoId &&
        session.value?.user?.id === userId
      ) {
        empleado.value = null
        console.error(
          "[EL DIARIO] No se pudo cargar el empleado:",
          error
        )
      }
    }
  }

  function actualizarSesion(
    nuevaSesion: { user: { id: string } } | null
  ) {
    const cargaId = ++cargaEmpleadoId

    session.value = nuevaSesion
    empleado.value = null

    if (!nuevaSesion?.user) return

    const userId = nuevaSesion.user.id

    // Evita hacer consultas de Supabase dentro del callback de autenticación.
    setTimeout(() => {
      if (
        cargaId !== cargaEmpleadoId ||
        session.value?.user?.id !== userId
      ) {
        return
      }

      void cargarEmpleado(userId, cargaId)
    }, 0)
  }

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
    // Limpiamos inmediatamente los datos visibles para impedir
    // que se conserve el nombre del usuario anterior.
    limpiarEstado()

    try {
      await authService.logout()
    } catch (error) {
      // Si Supabase no pudo cerrar la sesión, recuperamos
      // la sesión real para no dejar la aplicación desincronizada.
      try {
        const sesionActual = await authService.getSession()

        actualizarSesion(sesionActual)
      } catch {
        limpiarEstado()
      }

      throw error
    }
  }

  function clearSession() {
    limpiarEstado()
  }

  function detenerEscuchaAuth() {
    suscripcionAuth?.unsubscribe()
    suscripcionAuth = null
    inicializada = false
    limpiarEstado()
  }

  return {
    session,
    empleado,
    isAuthenticated,
    rolActual,
    initSession,
    login,
    logout,
    clearSession,
    detenerEscuchaAuth,
  }
})
