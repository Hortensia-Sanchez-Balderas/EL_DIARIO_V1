<template>
  <div class="dashboard-root">

    <AppHeader title="Menú de Inicio">
      <template #user>
        <div class="dash-user-area-inner">
          <button class="dash-user-btn" @click="showUserMenu = !showUserMenu">
            <img :src="icon('user.png')" alt="usuario" class="dash-user-avatar-img" />
            <span class="dash-user-name">{{ empleado?.nombre ?? "Adriana" }}</span>
            <svg viewBox="0 0 24 24" fill="white" width="20" height="20" style="flex-shrink:0">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </button>
          <div v-if="showUserMenu" class="dash-user-dropdown">
            <button @click="handleLogout">Cerrar sesión</button>
          </div>
        </div>
      </template>
    </AppHeader>

    <div class="dash-body">

      <CorkBoard
        banner-text="Mis registros de la semana"
        :stats="statsForBoard"
      />

      <section class="dash-modulos-section">
        <div class="modulos-grid">
          <button
            v-for="mod in modulos"
            :key="mod.label"
            class="modulo-btn"
            :style="{ background: mod.gradient }"
            @click="navigateTo(mod.route)"
          >
            <div class="modulo-icon-wrap">
              <img
                v-if="mod.icon"
                :src="mod.icon"
                :alt="mod.label"
                class="modulo-icon"
                :style="{ width: mod.iconW + 'px', height: mod.iconH + 'px' }"
              />
            </div>
            <span class="modulo-label">{{ mod.label }}</span>
          </button>
        </div>
      </section>

    </div>

    <div class="dash-footer-bar" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"
import AppHeader from "@/components/AppHeader.vue"
import CorkBoard from "@/components/CorkBoard.vue"

const router = useRouter()
const authStore = useAuthStore()
const base = import.meta.env.BASE_URL
const empleado = authStore.empleado
const showUserMenu = ref(false)
const loadingStats = ref(true)

const stats = ref([
  { id: "prospectos", label: "Prospectos\nRegistrados", value: 0 },
  { id: "contratos",  label: "Contratos\nFirmados",     value: 0 },
  { id: "radio",      label: "Paquetes\nde Radio",      value: 0 },
  { id: "periodico",  label: "Paquetes\nde Periódico",  value: 0 },
  { id: "ventas",     label: "Ventas\nTotales",         value: 0 },
])

const statsForBoard = computed(() =>
  stats.value.map(s => ({ ...s, loading: loadingStats.value }))
)

onMounted(async () => {
  if (!empleado?.id) { loadingStats.value = false; return }
  try {
    const { dashboardService } = await import("@/services/dashboardService")
    const res = await dashboardService.registrosSemana(empleado.id)
    stats.value[0].value = res.prospectos
    stats.value[1].value = res.contratos
    stats.value[2].value = res.paquetesRadio
    stats.value[3].value = res.paquetesPeriodico
    stats.value[4].value = res.ventasTotales
  } catch (e) {
    console.error("Error cargando estadísticas:", e)
  } finally {
    loadingStats.value = false
  }
})

const menuIcons = import.meta.glob("../imports/Menu/*.png", { eager: true, import: "default" }) as Record<string, string>
const icon = (name: string) => menuIcons[`../imports/Menu/${name}`] ?? ""

const modulos = [
  { label: "Nuevo Prospecto",       icon: icon("NuevoProspecto.png"),      iconW: 93,  iconH: 93, gradient: "linear-gradient(180deg,#20c25e 0%,#079968 100%)", route: "/prospectos/nuevo" },
  { label: "Seguimiento a Cliente", icon: icon("SeguimientoACliente.png"), iconW: 93,  iconH: 93, gradient: "linear-gradient(180deg,#1edae0 0%,#0b6e77 100%)", route: "/seguimiento" },
  { label: "Registros",             icon: icon("Registros.png"),           iconW: 68,  iconH: 93, gradient: "linear-gradient(180deg,#7cc91a 0%,#1ba547 100%)", route: "/registros" },
  { label: "Agenda",                icon: icon("Agenda.png"),              iconW: 106, iconH: 93, gradient: "linear-gradient(180deg,#6464f0 0%,#7b3dee 100%)", route: "/agenda" },
  { label: "Paquetes de Periódico", icon: icon("PaquetesPeriodico.png"),   iconW: 123, iconH: 93, gradient: "linear-gradient(180deg,#fa8c3c 0%,#ef4743 100%)", route: "/periodico" },
  { label: "Paquetes de Radio",     icon: icon("PaquetesRadio.png"),       iconW: 122, iconH: 93, gradient: "linear-gradient(180deg,#0059ff 0%,#003699 100%)", route: "/radio" },
  { label: "Editar / Pendientes",   icon: icon("Pendientes.png"),          iconW: 79,  iconH: 93, gradient: "linear-gradient(180deg,#fac73c 0%,#ef4743 100%)", route: "/pendientes" },
  { label: "Salir",                 icon: icon("Salir.png"),               iconW: 84,  iconH: 93, gradient: "linear-gradient(180deg,#da2527 0%,#bf133b 100%)", route: null },
]

function navigateTo(route: string | null) {
  if (!route) { handleLogout(); return }
  router.push(route)
}

async function handleLogout() {
  await authStore.logout()
  router.push({ name: "Login" })
}
</script>

<style scoped>
.dashboard-root {
  min-height: 100vh;
  background: #3a2422;
  display: flex;
  flex-direction: column;
}

.dash-user-area-inner { position: relative; }

.dash-user-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #00663b;
  border: none;
  border-radius: 10px;
  padding: 0 18px;
  height: 64px;
  cursor: pointer;
}

.dash-user-avatar-img {
  width: 51px;
  height: 51px;
  object-fit: contain;
  flex-shrink: 0;
}

.dash-user-name {
  font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif;
  font-size: 25px;
  font-weight: 400;
  color: #ffffff;
  white-space: nowrap;
}

.dash-user-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  min-width: 160px;
  z-index: 100;
  overflow: hidden;
}

.dash-user-dropdown button {
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  font-size: 15px;
  cursor: pointer;
  color: #333;
  font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif;
}

.dash-user-dropdown button:hover { background: #f5f5f5; }

.dash-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px 100px 16px;
  gap: 18px;
  min-height: 0;
}

.dash-modulos-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modulos-grid {
  display: grid;
  grid-template-columns: repeat(4, 253px);
  grid-template-rows: repeat(2, 126px);
  gap: 16px;
}

.modulo-btn {
  width: 253px;
  height: 126px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 8px 10px;
  transition: filter 0.15s, transform 0.1s;
  box-sizing: border-box;
}

.modulo-btn:hover  { filter: brightness(1.1); }
.modulo-btn:active { transform: scale(0.97); }

.modulo-icon-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modulo-icon { object-fit: contain; display: block; }

.modulo-label {
  font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #ffffff;
  text-align: center;
  line-height: 1.2;
  white-space: nowrap;
  flex-shrink: 0;
}

.dash-footer-bar {
  background: #f8f4e3;
  height: 50px;
  flex-shrink: 0;
}

@media (max-width: 1279px) {
  .dash-body      { padding: 10px 24px 12px; }
  .modulos-grid   { grid-template-columns: repeat(4, 1fr); grid-template-rows: auto; width: 100%; }
  .modulo-btn     { width: 100%; height: auto; min-height: 100px; }
}

@media (max-width: 900px) {
  .modulos-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .dash-body        { padding: 8px 12px 12px; gap: 12px; }
  .dash-user-name   { display: none; }
  .modulos-grid     { grid-template-columns: repeat(2, 1fr); }
}
</style>
