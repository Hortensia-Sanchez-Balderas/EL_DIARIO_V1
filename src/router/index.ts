import { createRouter, createWebHistory } from "vue-router"
import { supabase, supabaseConfigured } from "@/lib/supabase"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/LoginView.vue"),
      meta: { requiresGuest: true },
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("@/views/DashboardView.vue"),
      meta: { requiresAuth: true },
    },
    // Rutas de módulos — vistas pendientes de implementar una por una
    { path: "/prospectos/nuevo", name: "NuevoProspecto", component: () => import("@/views/NuevoProspectoView.vue"), meta: { requiresAuth: true } },
    { path: "/seguimiento",      name: "Seguimiento",    component: () => import("@/views/SeguimientoView.vue"), meta: { requiresAuth: true } },
    { path: "/seguimiento/detalle/:id", name: "VerDetalle",           component: () => import("@/views/VerDetalleView.vue"),           meta: { requiresAuth: true } },
    { path: "/seguimiento/historial",  name: "HistorialPedidos",     component: () => import("@/views/HistorialPedidosView.vue"),      meta: { requiresAuth: true } },
    { path: "/seguimiento/editar/:id", name: "EditarCliente",        component: () => import("@/views/EditarClienteView.vue"),         meta: { requiresAuth: true } },
    { path: "/seguimiento/solicitud",name: "NuevaSolicitudSeleccion", component: () => import("@/views/NuevaSolicitudSeleccionView.vue"), meta: { requiresAuth: true } },
    { path: "/registros",        name: "Registros",      component: () => import("@/views/RegistrosView.vue"), meta: { requiresAuth: true } },
    { path: "/agenda",           name: "Agenda",         component: () => import("@/views/AgendaView.vue"), meta: { requiresAuth: true } },
    { path: "/periodico",        name: "Periodico",      component: () => import("@/views/PaquetesPeriodicoView.vue"), meta: { requiresAuth: true } },
    { path: "/periodico/impresa", name: "PublicidadImpresa", component: () => import("@/views/PublicidadImpresaView.vue"), meta: { requiresAuth: true } },
    { path: "/periodico/:servicio", name: "TarifaPeriodico", component: () => import("@/views/TarifaPeriodicoView.vue"), meta: { requiresAuth: true } },
    { path: "/periodico/impresa/registro", name: "NuevaSolicitudRegistro", component: () => import("@/views/NuevaSolicitudRegistroView.vue"), meta: { requiresAuth: true } },
    { path: "/periodico/impresa/contrato", name: "ContratoPeriodicoView", component: () => import("@/views/ContratoPeriodicoView.vue"), meta: { requiresAuth: true } },
    { path: "/radio",            name: "Radio",          component: () => import("@/views/PaquetesRadioView.vue"), meta: { requiresAuth: true } },
    { path: "/radio/tarifa/:servicio", name: "TarifaRadio", component: () => import("@/views/SpotRadioTarifaView.vue"), meta: { requiresAuth: true } },
    { path: "/radio/solicitud",        name: "NuevaSolicitudRadio", component: () => import("@/views/NuevaSolicitudRadioView.vue"), meta: { requiresAuth: true } },
    { path: "/radio/contrato",         name: "ContratoRadioView",   component: () => import("@/views/ContratoRadioView.vue"), meta: { requiresAuth: true } },
    { path: "/pendientes",       name: "Pendientes",     component: () => import("@/views/PendientesView.vue"), meta: { requiresAuth: true } },
    { path: "/gerente",          name: "DashboardGerente",    component: () => import("@/views/DashboardGerenteView.vue"),    meta: { requiresAuth: false } },
    { path: "/gerente/personal",  name: "GestionPersonal",     component: () => import("@/views/GestionPersonalView.vue"),     meta: { requiresAuth: false } },
    { path: "/gerente/registros", name: "RegistrosGerente",   component: () => import("@/views/RegistrosGerenteView.vue"),     meta: { requiresAuth: false } },
  ],
})

// Guard de autenticación — activo solo cuando Supabase está configurado
router.beforeEach(async (to) => {
  if (!supabaseConfigured) return

  let autenticado = false
  try {
    const resultado = await Promise.race([
      supabase!.auth.getSession(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
    ])
    autenticado = !!(resultado && "data" in resultado && resultado.data.session)
  } catch {
    autenticado = false
  }

  if (to.meta.requiresAuth && !autenticado) return { name: "Login" }
  if (to.meta.requiresGuest && autenticado) return { name: "Dashboard" }
})

export default router
