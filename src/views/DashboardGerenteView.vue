<template>
  <div class="dashboard-root">

    <AppHeader title="Menú de Inicio">
      <template #user>
        <div class="napoleon-btn" data-napoleon @click="showMenu = !showMenu">
          <!-- Dropdown -->
          <div v-if="showMenu" class="napoleon-dropdown" @click.stop>
            <button @click="salir">Cerrar sesión</button>
          </div>
          <div class="napoleon-inner">
            <div class="napoleon-avatar">
              <img :src="`${base}assets/0411c.png`" class="napoleon-avatar-img" alt="" />
            </div>
            <span class="napoleon-name">Napoleon</span>
            <svg viewBox="0 0 24 24" fill="white" width="20" height="20" style="flex-shrink:0">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </div>
        </div>
      </template>
    </AppHeader>

    <div class="dash-body">

      <CorkBoard
        banner-text="Registros generales de la semana"
        :stats="statsForBoard"
      />

      <section class="dash-modulos-section">
        <div class="modulos-grid">

          <!-- Gestión de Personal -->
          <button class="modulo-btn" style="background:linear-gradient(180deg,#0059ff 0%,#003699 100%);" @click="irGestion">
            <div class="modulo-icon-wrap">
              <img :src="`${base}assets/069fa.png`" alt="Gestión de personal" class="modulo-icon" style="width:93px;height:93px;" />
            </div>
            <span class="modulo-label">Gestión de personal</span>
          </button>

          <!-- Registros -->
          <button class="modulo-btn" style="background:linear-gradient(180deg,#7cc91a 0%,#1ba547 100%);" @click="irRegistros">
            <div class="modulo-icon-wrap">
              <!-- Ilustración de portapapeles (misma del diseño original) -->
              <div class="clipboard-icon">
                <div class="clip-back" />
                <div class="clip-paper" />
                <div class="clip-line clip-line--wide" style="top:35%;" />
                <div class="clip-line clip-line--thin" style="top:22%;" />
                <div class="clip-cell" style="left:38%;top:56%;" />
                <div class="clip-cell" style="left:22%;top:56%;" />
                <div class="clip-cell" style="left:6%;top:56%;" />
                <div class="clip-ring" />
                <div class="clip-ring-top" />
              </div>
            </div>
            <span class="modulo-label">Registros</span>
          </button>

          <!-- Salir -->
          <button class="modulo-btn" style="background:linear-gradient(180deg,#da2527 0%,#bf133b 100%);" @click="salir">
            <div class="modulo-icon-wrap">
              <img :src="`${base}assets/86270.png`" alt="Salir" class="modulo-icon" style="width:84px;height:93px;" />
            </div>
            <span class="modulo-label">Salir</span>
          </button>

        </div>
      </section>

    </div>

    <div class="dash-footer-bar" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import AppHeader from "@/components/AppHeader.vue"
import CorkBoard from "@/components/CorkBoard.vue"

const router = useRouter()
const base = import.meta.env.BASE_URL
const showMenu = ref(false)

const loadingStats = ref(true)
const stats = ref([
  { id: "prospectos", label: "Prospectos\nRegistrados", value: 0 },
  { id: "contratos",  label: "Contratos\nFirmados",     value: 0 },
  { id: "radio",      label: "Paquetes\nde Radio",      value: 0 },
  { id: "periodico",  label: "Paquetes\nde Periódico",  value: 0 },
  { id: "vendedores", label: "Vendedores\nActivos",     value: 0 },
  { id: "ventas",     label: "Ventas\nTotales",         value: 0 },
])

const statsForBoard = computed(() =>
  stats.value.map(s => ({ ...s, loading: loadingStats.value }))
)

function closeMenu(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest("[data-napoleon]")) showMenu.value = false
}

onMounted(async () => {
  document.addEventListener("click", closeMenu)
  try {
    const { dashboardService } = await import("@/services/dashboardService")
    const res = await dashboardService.registrosSemanaGerente()
    stats.value[0].value = res.prospectosRegistrados
    stats.value[1].value = res.contratos
    stats.value[2].value = res.paquetesRadio
    stats.value[3].value = res.paquetesPeriodico
    stats.value[4].value = res.vendedores
    stats.value[5].value = res.ventasTotales
  } catch (e) {
    console.error("Error cargando stats gerente:", e)
  } finally {
    loadingStats.value = false
  }
})
onUnmounted(() => { document.removeEventListener("click", closeMenu) })

function salir() { router.push({ name: "Login" }) }
function irRegistros() { router.push({ name: "RegistrosGerente" }) }
function irGestion() { router.push({ name: "GestionPersonal" }) }
</script>

<style scoped>
.dashboard-root {
  min-height: 100vh;
  background: #3a2422;
  display: flex;
  flex-direction: column;
}

/* ── Napoleon user button ── */
.napoleon-btn {
  position: relative;
  cursor: pointer;
  user-select: none;
}

.napoleon-inner {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #00663b;
  border-radius: 10px;
  padding: 0 18px;
  height: 64px;
}

.napoleon-avatar {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 50%;
}

.napoleon-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.napoleon-name {
  font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif;
  font-size: 20px;
  color: #ffffff;
  white-space: nowrap;
}

.napoleon-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  min-width: 160px;
  z-index: 200;
  overflow: hidden;
}

.napoleon-dropdown button {
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

.napoleon-dropdown button:hover { background: #f5f5f5; }

/* ── Body ── */
.dash-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px 100px 16px;
  gap: 18px;
  min-height: 0;
}

/* ── Módulos ── */
.dash-modulos-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modulos-grid {
  display: grid;
  grid-template-columns: repeat(3, 331px);
  gap: 16px;
}

.modulo-btn {
  height: 165px;
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
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  text-align: center;
  line-height: 1.2;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ── Clipboard illustration ── */
.clipboard-icon {
  position: relative;
  width: 95px;
  height: 118px;
}

.clip-back {
  position: absolute;
  inset: 0;
  border-radius: 3px;
  background: linear-gradient(144.977deg, rgb(254,151,56) 2.52%, rgb(121,56,41) 97.28%);
}

.clip-paper {
  position: absolute;
  left: 6.5%;
  top: 17.5%;
  right: 0;
  bottom: 0;
  width: 88%;
  height: 87%;
  border-radius: 3px;
  background: linear-gradient(135deg, rgba(245,251,255,1) 0%, rgba(229,242,254,1) 40%, rgba(168,209,246,1) 100%);
  box-shadow: 0 4px 4px rgba(0,0,0,0.25);
}

.clip-line {
  position: absolute;
  left: 11.5%;
  border-radius: 30px;
  background: linear-gradient(135deg, rgba(209,231,251,1), rgba(173,207,241,1), rgba(137,184,230,1));
}

.clip-line--wide  { width: 78%; height: 20%; }
.clip-line--thin  { width: 78%; height: 12%; }

.clip-cell {
  position: absolute;
  width: 23%;
  height: 17%;
  border-radius: 2px;
  background: linear-gradient(135deg, rgba(209,231,251,1), rgba(173,207,241,1), rgba(137,184,230,1));
}

.clip-ring {
  position: absolute;
  left: 29%;
  top: 9%;
  width: 42%;
  height: 12%;
  border-radius: 3px 3px 1px 1px;
  background: linear-gradient(to bottom, #c2d0da, #6d7e89);
  box-shadow: 0 4px 4px rgba(145,181,214,0.9);
}

.clip-ring-top {
  position: absolute;
  left: 41%;
  top: 0;
  width: 20%;
  height: 7%;
  border-radius: 25px 25px 1px 1px;
  background: linear-gradient(125.71deg, rgb(197,211,221) 24.58%, rgb(118,135,145) 100%);
}

/* ── Footer ── */
.dash-footer-bar {
  background: #f8f4e3;
  height: 50px;
  flex-shrink: 0;
}

/* ── Responsive ── */
@media (max-width: 1279px) {
  .dash-body    { padding: 10px 24px 12px; }
  .modulos-grid { grid-template-columns: repeat(3, 1fr); width: 100%; }
  .modulo-btn   { width: 100%; height: auto; min-height: 130px; }
}

@media (max-width: 640px) {
  .dash-body    { padding: 8px 12px 12px; gap: 12px; }
  .modulos-grid { grid-template-columns: repeat(2, 1fr); }
  .napoleon-name { display: none; }
}
</style>
