<template>
  <div class="pr-root">

    <!-- ── HEADER ─────────────────────────────────────────── -->
    <header class="pr-header">
      <img :src="`${base}Logo.png`" alt="El Diario de Coahuila" class="pr-logo" />
      <h1 class="pr-titulo">PAQUETES DE RADIO</h1>
      <button class="pr-regresar-btn" @click="regresar">
        <img :src="`${base}assets/regresar-icon.png`" alt="" class="pr-regresar-icon" />
        <span>Regresar</span>
      </button>
    </header>

    <!-- ── CUERPO ──────────────────────────────────────────── -->
    <div class="pr-body">
      <p class="pr-subtitulo">Seleccione el servicio que desea cotizar</p>

      <div class="pr-grid">
        <button
          v-for="servicio in servicios"
          :key="servicio.id"
          class="pr-carpeta"
          @click="seleccionar(servicio)"
        >
          <!-- Tab superior -->
          <div class="pr-carpeta-tab" />
          <!-- Cuerpo de la carpeta -->
          <div class="pr-carpeta-body">
            <div class="pr-icono-wrap">
              <img
                :src="`${base}assets/${servicio.img}`"
                :alt="servicio.label"
                class="pr-icono"
              />
              <img
                v-if="servicio.img2"
                :src="`${base}assets/${servicio.img2}`"
                :alt="servicio.label"
                class="pr-icono pr-icono2"
              />
            </div>
            <span class="pr-carpeta-label">{{ servicio.label }}</span>
          </div>
        </button>
      </div>
    </div>

    <!-- ── FOOTER ──────────────────────────────────────────── -->
    <div class="pr-footer" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()
const base = import.meta.env.BASE_URL

const servicios = [
  { id: "spot",          label: "Spot Publicitario", img: "418b4.png",            route: "/radio/spot"          },
  { id: "cortinilla",    label: "Cortinilla",         img: "f6801.png",            route: "/radio/cortinilla"    },
  { id: "entrevista",    label: "Entrevista",          img: "33737.png",            route: "/radio/entrevista"    },
  { id: "programas",     label: "Programas",           img: "5ce8d.png", img2: "bfe2f.png", route: "/radio/programas" },
  { id: "mencion",       label: "Mención",             img: "95853.png",            route: "/radio/mencion"       },
  { id: "control-remoto",label: "Control Remoto",      img: "06ab8.png",            route: "/radio/control-remoto"},
  { id: "patrocinios",   label: "Patrocinios",         img: "3c2c6.png",            route: "/radio/patrocinios"   },
  { id: "blinks",        label: "Blinks",              img: "f5d9f.png",            route: "/radio/blinks"        },
]

function seleccionar(servicio: typeof servicios[0]) {
  router.push({ name: "TarifaRadio", params: { servicio: servicio.id } })
}

function regresar() {
  router.push({ name: "Dashboard" })
}
</script>

<style scoped>
/* ── Raíz ─────────────────────────────────────────────────── */
.pr-root {
  min-height: 100vh;
  background: #3a2422;
  display: flex;
  flex-direction: column;
}

/* ── Header ──────────────────────────────────────────────── */
.pr-header {
  background: #008a52;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
  position: relative;
}

.pr-logo {
  width: 296px;
  height: 69px;
  object-fit: contain;
  object-position: left center;
  display: block;
  flex-shrink: 0;
}

.pr-titulo {
  font-family: 'Lilita One:Regular', 'Lilita One', sans-serif;
  font-size: clamp(22px, 3vw, 40px);
  font-weight: 400;
  color: #ffffff;
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

.pr-regresar-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #d92525;
  border: none;
  border-radius: 10px;
  padding: 0 24px;
  height: 60px;
  cursor: pointer;
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 25px;
  color: #ffffff;
  white-space: nowrap;
  transition: filter 0.15s;
}
.pr-regresar-btn:hover { filter: brightness(1.1); }

.pr-regresar-icon {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

/* ── Cuerpo ──────────────────────────────────────────────── */
.pr-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 40px 16px;
  gap: 16px;
}

.pr-subtitulo {
  font-family: 'Lilita One:Regular', 'Lilita One', sans-serif;
  font-size: 32px;
  font-weight: 400;
  color: #ffffff;
  margin: 0;
  text-align: center;
  white-space: nowrap;
}

/* ── Grid 4×2 ────────────────────────────────────────────── */
.pr-grid {
  display: grid;
  grid-template-columns: repeat(4, 238px);
  grid-template-rows: repeat(2, auto);
  gap: 20px 28px;
}

/* ── Carpeta ─────────────────────────────────────────────── */
.pr-carpeta {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: transform 0.12s, filter 0.12s;
}
.pr-carpeta:hover  { transform: translateY(-4px); filter: brightness(1.06); }
.pr-carpeta:active { transform: translateY(0); }

/* Tab amarillo oscuro */
.pr-carpeta-tab {
  width: 136px;
  height: 24px;
  background: #ffe38e;
  border-radius: 7px 7px 0 0;
}

/* Cuerpo de la carpeta */
.pr-carpeta-body {
  width: 238px;
  background: #f5e1a4;
  border-radius: 0 7px 7px 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 12px 12px;
  gap: 8px;
}

/* Icono principal */
.pr-icono-wrap {
  position: relative;
  width: 131px;
  height: 131px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pr-icono {
  width: 131px;
  height: 131px;
  object-fit: contain;
  display: block;
}

/* Segundo icono (Programas) superpuesto abajo-derecha */
.pr-icono2 {
  position: absolute;
  width: 65px;
  height: 65px;
  right: -16px;
  bottom: 0;
}

.pr-carpeta-label {
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #000000;
  text-align: center;
  line-height: 1.3;
}

/* ── Footer ──────────────────────────────────────────────── */
.pr-footer {
  background: #f8f4e3;
  height: 50px;
  flex-shrink: 0;
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 1050px) {
  .pr-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 14px 16px;
  }
  .pr-carpeta-body { width: 100%; }
  .pr-carpeta-tab  { width: 57%; }
}

@media (max-width: 700px) {
  .pr-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px 16px;
  }
  .pr-subtitulo { font-size: 20px; white-space: normal; text-align: center; }
  .pr-titulo    { font-size: clamp(20px, 3vw, 36px); }
}

@media (max-width: 480px) {
  .pr-grid { grid-template-columns: 1fr 1fr; }
  .pr-regresar-btn { padding: 0 14px; font-size: 18px; }
  .pr-header { padding: 0 12px; height: 80px; }
  .pr-logo   { width: clamp(140px, 22vw, 296px); height: auto; }
}
</style>
