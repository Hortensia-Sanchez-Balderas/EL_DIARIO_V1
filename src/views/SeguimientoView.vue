<template>
  <div class="seg-root">
    <!-- HEADER -->
    <header class="seg-header">
      <div class="seg-logo">
        <img :src="`${base}Logo.png`" alt="El Diario" style="height:69px;width:296px;object-fit:contain;" />
      </div>
      <span class="seg-titulo">Seguimiento a clientes</span>
      <button class="btn-regresar" @click="$router.push({ name: 'Dashboard' })">
        <img :src="`${base}assets/f79f1.png`" alt="" style="width:36px;height:36px;" />
        Regresar
      </button>
    </header>

    <!-- CONTENT AREA -->
    <div class="seg-body">
      <!-- Folder / clipboard wrapper -->
      <div class="carpeta-wrap">
        <!-- Tab label strip (yellow upper-left) -->
        <div class="carpeta-tab">
          <!-- Search bar -->
          <div class="buscador-wrap">
            <input
              v-model="busqueda"
              class="buscador-input"
              placeholder="Buscar por nombre o ID"
            />
            <div class="buscador-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c0bebe" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
          </div>
        </div>

        <!-- Main card -->
        <div class="carpeta-card">
          <!-- Clip decoration -->
          <div class="clip-dec">
            <img :src="`${base}assets/ea70e.svg`" alt="" style="width:72px;" />
          </div>

          <!-- Inner white panel -->
          <div class="card-inner">
            <!-- Filter tabs -->
            <div class="tabs-row">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                class="tab-btn"
                :class="{ 'tab-btn--activo': tabActivo === tab.id }"
                @click="tabActivo = tab.id"
              >
                {{ tab.label }}
              </button>
            </div>

            <!-- Table header -->
            <div class="tabla-header">
              <span class="th th-id">ID</span>
              <span class="th th-cliente">Cliente</span>
              <span class="th th-contacto">Contacto</span>
              <span class="th th-tipo">Tipo</span>
              <span class="th th-estado">Estado</span>
              <span class="th th-acciones">Acciones</span>
            </div>

            <!-- Table body -->
            <div class="tabla-body">
              <!-- Scroll up -->
              <button class="scroll-btn scroll-btn--up" @click="scrollUp">
                <img :src="`${base}assets/adf9a.png`" alt="" style="width:14px;transform:rotate(90deg);" />
              </button>

              <div class="tabla-rows" ref="tbodyRef">
                <div
                  v-for="cliente in clientesFiltrados"
                  :key="cliente.id"
                  class="tabla-row"
                >
                  <span class="td td-id">{{ String(cliente.id).padStart(2, '0') }}</span>
                  <span class="td td-cliente">{{ cliente.nombre }}</span>
                  <span class="td td-contacto">{{ cliente.contacto }}</span>
                  <span class="td td-tipo">{{ cliente.tipo }}</span>
                  <span class="td td-estado">{{ cliente.estado }}</span>
                  <span class="td td-acciones">
                    <button class="btn-accion btn-ver" @click="verDetalle(cliente)">
                      <img :src="`${base}assets/960b8.png`" alt="" style="width:15px;height:15px;" />
                      Ver Detalle
                    </button>
                    <button class="btn-accion btn-solicitud" @click="nuevaSolicitud(cliente)">
                      <img :src="`${base}assets/b9f9b.png`" alt="" style="width:15px;height:15px;" />
                      Nueva Solicitud
                    </button>
                  </span>
                </div>
                <div v-if="clientesFiltrados.length === 0" class="tabla-vacia">
                  Sin resultados
                </div>
              </div>

              <!-- Scroll down -->
              <button class="scroll-btn scroll-btn--down" @click="scrollDown">
                <img :src="`${base}assets/adf9a.png`" alt="" style="width:14px;transform:rotate(-90deg);" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <footer class="seg-footer"></footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { Prospecto } from '@/types'

const base = import.meta.env.BASE_URL
const router = useRouter()
const authStore = useAuthStore()

const busqueda = ref('')
const tabActivo = ref('todos')
const tbodyRef = ref<HTMLElement | null>(null)
const cargando = ref(true)

const tabs = [
  { id: 'todos',      label: 'TODOS'      },
  { id: 'activos',    label: 'ACTIVOS'    },
  { id: 'inactivos',  label: 'INACTIVOS'  },
  { id: 'prospectos', label: 'PROSPECTOS' },
]

interface Cliente {
  id: number
  nombre: string
  contacto: string
  tipo: string
  estado: string
  telefono?: string
  email?: string
}

const clientes = ref<Cliente[]>([])

function prospectoACliente(p: Prospecto): Cliente {
  return {
    id: p.id,
    nombre: p.nombre_empresa,
    contacto: p.nombre_contacto,
    tipo: p.cargo_contacto ?? '-',
    estado: p.estado,
    telefono: p.telefono ?? undefined,
    email: p.email_contacto ?? undefined,
  }
}

onMounted(async () => {
  try {
    const { prospectoService } = await import('@/services/prospectoService')
    const empleadoId = authStore.empleado?.id
    const data = empleadoId
      ? await prospectoService.listarPorEmpleado(empleadoId)
      : await prospectoService.listar()
    clientes.value = data.map(prospectoACliente)
  } catch (e) {
    console.error('Error cargando prospectos:', e)
  } finally {
    cargando.value = false
  }
})

const clientesFiltrados = computed(() => {
  let lista = clientes.value
  if (tabActivo.value !== 'todos') {
    const mapa: Record<string, string> = {
      activos: 'Cliente', inactivos: 'Baja', prospectos: 'Prospecto'
    }
    lista = lista.filter(c => c.estado === mapa[tabActivo.value])
  }
  if (busqueda.value.trim()) {
    const q = busqueda.value.toLowerCase()
    lista = lista.filter(c =>
      c.nombre.toLowerCase().includes(q) ||
      String(c.id).includes(q)
    )
  }
  return lista
})

function scrollUp() {
  tbodyRef.value?.scrollBy({ top: -80, behavior: 'smooth' })
}
function scrollDown() {
  tbodyRef.value?.scrollBy({ top: 80, behavior: 'smooth' })
}

function verDetalle(cliente: Cliente) {
  router.push({ name: 'VerDetalle', params: { id: cliente.id } })
}
function nuevaSolicitud(cliente: Cliente) {
  router.push({ name: 'NuevaSolicitudSeleccion', state: { prospectoId: cliente.id } })
}
</script>

<style scoped>
.seg-root {
  min-height: 100vh;
  background: #3a2422;
  display: flex;
  flex-direction: column;
  font-family: 'Baloo Paaji:Regular', sans-serif;
}

/* ── Header ─────────────────────────────────────────────────── */
.seg-header {
  height: 100px;
  background: #008a52;
  display: flex;
  align-items: center;
  padding: 0 24px;
  position: relative;
  flex-shrink: 0;
}
.seg-logo { display: flex; align-items: center; }
.seg-titulo {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Lilita One:Regular', sans-serif;
  font-size: 40px;
  color: #fff;
  white-space: nowrap;
}
.btn-regresar {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #d92525;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0 28px;
  height: 60px;
  font-family: 'Baloo Paaji:Regular', sans-serif;
  font-size: 25px;
  cursor: pointer;
}

/* ── Body ────────────────────────────────────────────────────── */
.seg-body {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 20px 24px 16px;
}
.carpeta-wrap {
  width: 1030px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Yellow tab with search */
.carpeta-tab {
  background: #f9f3d2;
  border-radius: 10px 10px 0 0;
  padding: 16px 20px 12px;
  width: 100%;
  box-shadow: 10px 0 10px rgba(0,0,0,0.25);
  box-sizing: border-box;
}
.buscador-wrap {
  display: flex;
  align-items: center;
  border: 2px solid #d0ccc8;
  border-radius: 5px;
  overflow: hidden;
  background: #fff;
}
.buscador-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 8px 16px;
  font-family: 'Baloo Paaji:Regular', sans-serif;
  font-size: 18px;
  color: #767575;
  background: #fff;
}
.buscador-btn {
  background: #fff;
  width: 47px;
  height: 41px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 2px solid #d0ccc8;
}

/* Main card */
.carpeta-card {
  background: #f5e1a4;
  border: 3px solid #f5e1a4;
  border-radius: 7px;
  position: relative;
  padding-bottom: 16px;
}
.clip-dec {
  position: absolute;
  left: -20px;
  bottom: 8px;
  z-index: 2;
}
.card-inner {
  background: #fff;
  border: 1px solid #000;
  margin: 8px 12px;
  border-radius: 2px;
  overflow: hidden;
}

/* ── Tabs ─────────────────────────────────────────────────────── */
.tabs-row {
  display: flex;
  gap: 4px;
  padding: 8px 8px 0;
  background: #fff;
}
.tab-btn {
  flex: 1;
  height: 52px;
  border: none;
  border-radius: 5px;
  background: #635251;
  color: #fff;
  font-family: 'Baloo Paaji:Regular', sans-serif;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.15s;
}
.tab-btn--activo { background: #463d3b; }
.tab-btn:hover:not(.tab-btn--activo) { background: #7a6160; }

/* ── Table ────────────────────────────────────────────────────── */
.tabla-header {
  display: flex;
  align-items: center;
  background: #d9d9d9;
  padding: 6px 8px;
  margin-top: 4px;
}
.th {
  font-family: 'Ligconsolata:Regular', monospace;
  font-size: 18px;
  color: #000;
  text-align: center;
}
.th-id       { width: 48px; }
.th-cliente  { flex: 2; }
.th-contacto { flex: 2; }
.th-tipo     { flex: 1.2; }
.th-estado   { flex: 1.2; }
.th-acciones { flex: 2; text-align: center; }

.tabla-body {
  position: relative;
  display: flex;
  flex-direction: column;
}
.tabla-rows {
  max-height: 280px;
  overflow-y: auto;
  scrollbar-width: none;
}
.tabla-rows::-webkit-scrollbar { display: none; }

.tabla-row {
  display: flex;
  align-items: center;
  padding: 8px 8px;
  border-bottom: 1px solid #e0e0e0;
}
.tabla-row:last-child { border-bottom: none; }
.td {
  font-family: 'Ligconsolata:Regular', monospace;
  font-size: 18px;
  color: #1e1e1e;
}
.td-id       { width: 48px; text-align: center; }
.td-cliente  { flex: 2; }
.td-contacto { flex: 2; }
.td-tipo     { flex: 1.2; }
.td-estado   { flex: 1.2; }
.td-acciones { flex: 2; display: flex; gap: 6px; justify-content: flex-end; }

.tabla-vacia {
  padding: 24px;
  text-align: center;
  color: #999;
  font-family: 'Baloo Paaji:Regular', sans-serif;
}

.btn-accion {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #30a5ce;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 4px 10px;
  font-family: 'Baloo Paaji:Regular', sans-serif;
  font-size: 13px;
  cursor: pointer;
  height: 31px;
  white-space: nowrap;
}

.scroll-btn {
  align-self: flex-end;
  margin: 4px 8px;
  width: 25px;
  height: 25px;
  border: none;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.scroll-btn--up   { background: #a79c95; order: -1; align-self: flex-end; }
.scroll-btn--down { background: #635251; }

/* ── Footer ──────────────────────────────────────────────────── */
.seg-footer {
  height: 50px;
  background: #f8f4e3;
  flex-shrink: 0;
}
</style>
