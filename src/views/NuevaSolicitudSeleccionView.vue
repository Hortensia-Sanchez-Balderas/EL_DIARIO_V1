<template>
  <div class="nss-root">
    <!-- HEADER -->
    <header class="nss-header">
      <div class="nss-logo">
        <img :src="`${base}Logo.png`" alt="El Diario" style="height:69px;width:296px;object-fit:contain;" />
      </div>
      <span class="nss-titulo">Nueva Solicitud</span>
      <button class="btn-regresar" @click="$router.back()">
        <img :src="`${base}assets/f79f1.png`" alt="" style="width:36px;height:36px;" />
        Regresar
      </button>
    </header>

    <!-- BODY -->
    <div class="nss-body">
      <!-- Main card -->
      <div class="nss-card">
        <!-- Green bar -->
        <div class="nss-green-bar">
          <span class="nss-bar-titulo">Seleccionar tipo de solicitud</span>
          <button class="btn-x" @click="$router.back()">
            <img :src="`${base}assets/7422c.png`" alt="cerrar" style="width:22px;height:22px;" />
          </button>
        </div>

        <!-- Two folder options -->
        <div class="nss-opciones">
          <!-- Periódico -->
          <div class="nss-folder" @click="irPeriodico">
            <div class="nss-folder-bg">
              <img :src="`${base}assets/50630.svg`" alt="" class="nss-folder-svg" />
            </div>
            <div class="nss-folder-card">
              <img :src="`${base}assets/6d567.png`" alt="Periódico" style="width:82px;height:82px;object-fit:contain;" />
              <span class="nss-folder-label">Periodico</span>
            </div>
          </div>

          <!-- Radio -->
          <div class="nss-folder" @click="irRadio">
            <div class="nss-folder-bg">
              <img :src="`${base}assets/50630.svg`" alt="" class="nss-folder-svg" />
            </div>
            <div class="nss-folder-card">
              <img :src="`${base}assets/a2fdd.png`" alt="Radio" style="width:75px;height:75px;object-fit:contain;" />
              <span class="nss-folder-label">Radio</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <footer class="nss-footer"></footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const base = import.meta.env.BASE_URL
const router = useRouter()

function irPeriodico() {
  router.push({ name: 'PublicidadImpresa' })
}
function irRadio() {
  router.push({ name: 'Radio' })
}
</script>

<style scoped>
.nss-root {
  min-height: 100vh;
  background: #3a2422;
  display: flex;
  flex-direction: column;
  font-family: 'Baloo Paaji:Regular', sans-serif;
}

/* ── Header ─────────────────────────────────────────────────── */
.nss-header {
  height: 100px;
  background: #008a52;
  display: flex;
  align-items: center;
  padding: 0 24px;
  position: relative;
  flex-shrink: 0;
}
.nss-logo { display: flex; align-items: center; }
.nss-titulo {
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
.nss-body {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 16px 24px;
}
.nss-card {
  width: 1030px;
  max-width: 100%;
  background: #f8f4e3;
  border: 3px solid #1e1e1e;
  border-radius: 7px;
  box-shadow: 10px 0 10px rgba(0,0,0,0.25);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ── Green bar ────────────────────────────────────────────────── */
.nss-green-bar {
  background: #008a52;
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  position: relative;
}
.nss-bar-titulo {
  font-family: 'Lilita One:Regular', sans-serif;
  font-size: 36px;
  color: #fff;
  flex: 1;
  text-align: center;
}
.btn-x {
  width: 40px;
  height: 40px;
  background: #d92525;
  border: none;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

/* ── Options ──────────────────────────────────────────────────── */
.nss-opciones {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 80px;
  padding: 48px 32px;
}
.nss-folder {
  position: relative;
  width: 333px;
  height: 360px;
  cursor: pointer;
  transition: transform 0.15s;
}
.nss-folder:hover { transform: scale(1.03); }
.nss-folder-bg {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nss-folder-svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform: rotate(-90deg);
}
.nss-folder-card {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: 247px;
  height: 101px;
  background: #f8f4e3;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.nss-folder-label {
  font-family: 'Baloo Paaji:Regular', sans-serif;
  font-size: 25px;
  color: #3a2422;
}

/* ── Footer ──────────────────────────────────────────────────── */
.nss-footer {
  height: 50px;
  background: #f8f4e3;
  flex-shrink: 0;
}
</style>
