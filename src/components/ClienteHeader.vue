<template>
  <AppHeader :title="title">
    <template #user>
      <div class="ch-acciones">
        <button
          v-if="mostrarCarrito"
          class="ch-carrito-btn"
          aria-label="Ver carrito"
          @click="router.push({ name: 'ClienteCarrito' })"
        >
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1.4" /><circle cx="19" cy="21" r="1.4" />
            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
          </svg>
          <span v-if="cliente.totalPiezas" class="ch-badge">{{ cliente.totalPiezas }}</span>
        </button>

        <button v-if="regresarA" class="ch-regresar-btn" @click="router.push({ name: regresarA })">
          <img :src="`${base}assets/regresar-icon.png`" alt="" class="ch-regresar-icon" />
          <span>Regresar</span>
        </button>

        <div v-else class="ch-user-wrap">
          <button class="ch-user-btn" @click="menu = !menu">
            <img :src="userIcon" alt="usuario" class="ch-user-avatar" />
            <span class="ch-user-name">{{ auth.cliente?.nombre ?? "Cliente" }}</span>
            <svg viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M7 10l5 5 5-5z" /></svg>
          </button>
          <div v-if="menu" class="ch-dropdown">
            <button @click="router.push({ name: 'ClienteCompras' })">Mis compras</button>
            <button @click="salir">Cerrar sesión</button>
          </div>
        </div>
      </div>
    </template>
  </AppHeader>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import AppHeader from "@/components/AppHeader.vue"
import { useAuthStore } from "@/stores/auth"
import { useClienteStore } from "@/stores/cliente"
import userIcon from "@/imports/Menu/user.png"

withDefaults(defineProps<{ title: string; regresarA?: string; mostrarCarrito?: boolean }>(), {
  mostrarCarrito: true,
})

const router = useRouter()
const auth = useAuthStore()
const cliente = useClienteStore()
const base = import.meta.env.BASE_URL
const menu = ref(false)

async function salir() {
  await auth.logout()
  router.push({ name: "Login" })
}
</script>

<style scoped>
.ch-acciones { display: flex; align-items: center; gap: 14px; }

.ch-carrito-btn {
  position: relative;
  width: 64px; height: 60px;
  background: #00663b;
  border: none; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: filter .15s;
}
.ch-carrito-btn:hover { filter: brightness(1.15); }
.ch-badge {
  position: absolute; top: -6px; right: -6px;
  min-width: 24px; height: 24px; padding: 0 6px;
  background: #fac73c; color: #3a2422;
  border-radius: 12px; font: 700 14px/24px "Inter", sans-serif;
}

.ch-regresar-btn {
  display: flex; align-items: center; gap: 10px;
  background: #d92525; border: none; border-radius: 10px;
  padding: 0 24px; height: 60px; cursor: pointer;
  font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif;
  font-size: 25px; color: #fff; white-space: nowrap; transition: filter .15s;
}
.ch-regresar-btn:hover { filter: brightness(1.1); }
.ch-regresar-icon { width: 36px; height: 36px; object-fit: contain; }

.ch-user-wrap { position: relative; }
.ch-user-btn {
  display: flex; align-items: center; gap: 10px;
  background: #00663b; border: none; border-radius: 10px;
  padding: 0 18px; height: 64px; cursor: pointer;
}
.ch-user-avatar { width: 51px; height: 51px; object-fit: contain; }
.ch-user-name {
  font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif;
  font-size: 25px; color: #fff; white-space: nowrap;
}
.ch-dropdown {
  position: absolute; top: calc(100% + 6px); right: 0;
  background: #fff; border-radius: 8px; min-width: 170px; z-index: 100;
  box-shadow: 0 4px 16px rgba(0,0,0,.2); overflow: hidden;
}
.ch-dropdown button {
  width: 100%; padding: 12px 16px; background: none; border: none; text-align: left;
  font-size: 15px; cursor: pointer; color: #333;
  font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif;
}
.ch-dropdown button:hover { background: #f5f5f5; }

@media (max-width: 640px) {
  .ch-user-name { display: none; }
  .ch-regresar-btn { padding: 0 14px; font-size: 18px; height: 50px; }
  .ch-regresar-btn span { display: none; }
  .ch-carrito-btn { width: 52px; height: 50px; }
}
</style>
