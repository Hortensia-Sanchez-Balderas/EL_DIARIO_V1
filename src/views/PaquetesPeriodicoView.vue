<template>
  <div class="pp-root">

    <!-- ── HEADER ─────────────────────────────────────────── -->
    <header class="pp-header">
      <div class="pp-logo">
        <img :src="`${base}Logo.png`" alt="El Diario de Coahuila" class="pp-logo-img" />
      </div>
      <h1 class="pp-title">Paquetes de periódico</h1>
      <button class="pp-regresar-btn" @click="regresar">
        <img :src="`${base}assets/regresar-icon.png`" alt="" class="pp-regresar-icon" />
        <span>Regresar</span>
      </button>
    </header>

    <!-- ── CUERPO ──────────────────────────────────────────── -->
    <div class="pp-body">
      <p class="pp-subtitle">Seleccione el servicio que desea cotizar</p>

      <div class="pp-grid">

        <button
          v-for="servicio in servicios"
          :key="servicio.id"
          class="pp-folder"
          @click="seleccionar(servicio)"
        >
          <!-- Tab superior de la carpeta -->
          <div class="pp-folder-tab" />
          <!-- Cuerpo de la carpeta -->
          <div class="pp-folder-body">
            <img
              :src="`${base}assets/${servicio.img}`"
              :alt="servicio.label"
              class="pp-folder-icon"
            />
            <span class="pp-folder-label">{{ servicio.label }}</span>
          </div>
        </button>

      </div>
    </div>

    <!-- ── FOOTER ──────────────────────────────────────────── -->
    <div class="pp-footer" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()
const base = import.meta.env.BASE_URL

const servicios = [
  { id: "digital",       label: "Publicidad digital",  img: "b777b.png" },
  { id: "clasificados",  label: "Clasificados",         img: "cc13e.png" },
  { id: "eventos",       label: "Eventos sociales",     img: "4263c.png" },
  { id: "impresa",       label: "Publicidad impresa",   img: "ba78e.png" },
]

function seleccionar(servicio: typeof servicios[0]) {
  if (servicio.id === "impresa") {
    router.push({ name: "PublicidadImpresa" })
  } else {
    router.push({ name: "TarifaPeriodico", params: { servicio: servicio.id } })
  }
}

function regresar() {
  router.push({ name: "Dashboard" })
}
</script>

<style scoped>
/* ── Raíz ─────────────────────────────────────────────────── */
.pp-root {
  min-height: 100vh;
  background: #3a2422;
  display: flex;
  flex-direction: column;
}

/* ── Header ──────────────────────────────────────────────── */
.pp-header {
  background: #008a52;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
  position: relative;
}

.pp-logo { flex-shrink: 0; }

.pp-logo-img {
  width: 296px;
  height: 69px;
  object-fit: contain;
  object-position: left center;
  display: block;
}

.pp-title {
  font-family: 'Lilita One:Regular', 'Lilita One', sans-serif;
  font-size: 40px;
  font-weight: 400;
  color: #ffffff;
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

.pp-regresar-btn {
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
.pp-regresar-btn:hover { filter: brightness(1.1); }

.pp-regresar-icon {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

/* ── Cuerpo ──────────────────────────────────────────────── */
.pp-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 40px 16px;
  gap: 24px;
}

.pp-subtitle {
  font-family: 'Lilita One:Regular', 'Lilita One', sans-serif;
  font-size: 32px;
  font-weight: 400;
  color: #ffffff;
  margin: 0;
  text-align: center;
  white-space: nowrap;
}

/* ── Grid 2×2 ────────────────────────────────────────────── */
.pp-grid {
  display: grid;
  grid-template-columns: repeat(2, 238px);
  grid-template-rows: repeat(2, auto);
  gap: 28px 40px;
}

/* ── Carpeta ─────────────────────────────────────────────── */
.pp-folder {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: transform 0.12s, filter 0.12s;
}

.pp-folder:hover  { transform: translateY(-4px); filter: brightness(1.06); }
.pp-folder:active { transform: translateY(0); }

/* Tab amarillo oscuro en la parte superior */
.pp-folder-tab {
  width: 136px;
  height: 24px;
  background: #ffe38e;
  border-radius: 7px 7px 0 0;
  margin-left: 0;
}

/* Cuerpo de la carpeta */
.pp-folder-body {
  width: 238px;
  background: #f5e1a4;
  border-radius: 0 7px 7px 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 12px 14px;
  gap: 10px;
}

.pp-folder-icon {
  width: 131px;
  height: 131px;
  object-fit: contain;
  display: block;
}

.pp-folder-label {
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #000000;
  text-align: center;
  line-height: 1.3;
}

/* ── Footer ──────────────────────────────────────────────── */
.pp-footer {
  background: #f8f4e3;
  height: 50px;
  flex-shrink: 0;
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 700px) {
  .pp-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 20px;
  }
  .pp-folder-body { width: 100%; }
  .pp-folder-tab  { width: 60%; }
  .pp-subtitle    { font-size: 22px; white-space: normal; text-align: center; }
  .pp-title       { font-size: clamp(22px, 3vw, 40px); }
  .pp-logo-img    { width: clamp(140px, 22vw, 296px); height: auto; }
}

@media (max-width: 480px) {
  .pp-grid { grid-template-columns: 1fr; }
  .pp-folder-body { width: 100%; max-width: 280px; margin: 0 auto; }
  .pp-regresar-btn { padding: 0 14px; font-size: 18px; }
  .pp-header { padding: 0 12px; height: 80px; }
}
</style>
