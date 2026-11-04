<template>
  <div class="cli-root">
    <ClienteHeader title="Tienda en Línea" />

    <div class="cli-body">
      <CorkBoard banner-text="Mis compras" :stats="stats" />

      <p class="cli-bienvenida">
        ¡Hola, {{ auth.cliente?.nombre ?? "Cliente" }}! Compra tu publicidad en línea en minutos.
      </p>

      <section class="cli-modulos">
        <button
          v-for="mod in modulos"
          :key="mod.label"
          class="modulo-btn"
          :style="{ background: mod.gradient }"
          @click="ir(mod.route)"
        >
          <div class="modulo-icon-wrap">
            <img v-if="mod.icon" :src="mod.icon" :alt="mod.label" class="modulo-icon"
                 :style="{ width: mod.iconW + 'px', height: '93px' }" />
            <svg v-else viewBox="0 0 24 24" width="88" height="88" fill="none" stroke="#fff"
                 stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1.4" /><circle cx="19" cy="21" r="1.4" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
            <span v-if="mod.badge" class="modulo-badge">{{ mod.badge }}</span>
          </div>
          <span class="modulo-label">{{ mod.label }}</span>
        </button>
      </section>
    </div>

    <div class="cli-footer" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"
import { useClienteStore } from "@/stores/cliente"
import ClienteHeader from "@/components/ClienteHeader.vue"
import CorkBoard from "@/components/CorkBoard.vue"

const router = useRouter()
const auth = useAuthStore()
const cliente = useClienteStore()

const menuIcons = import.meta.glob("../imports/Menu/*.png", { eager: true, import: "default" }) as Record<string, string>
const icon = (name: string) => menuIcons[`../imports/Menu/${name}`] ?? ""

const stats = computed(() => {
  const items = cliente.pedidos.flatMap((p) => p.items)
  const contar = (medio: string) =>
    items.filter((i) => i.producto.medio === medio).reduce((a, i) => a + i.cantidad, 0)
  return [
    { id: "compras",   label: "Compras\nRealizadas",    value: cliente.pedidos.length },
    { id: "carrito",   label: "Productos\nen Carrito",  value: cliente.totalPiezas },
    { id: "periodico", label: "Anuncios de\nPeriódico", value: contar("periodico") },
    { id: "radio",     label: "Servicios\nde Radio",    value: contar("radio") },
  ]
})

const modulos = computed(() => [
  { label: "Comprar en Periódico", icon: icon("PaquetesPeriodico.png"), iconW: 123, gradient: "linear-gradient(180deg,#fa8c3c 0%,#ef4743 100%)", route: "/cliente/tienda/periodico" },
  { label: "Comprar en Radio",     icon: icon("PaquetesRadio.png"),     iconW: 122, gradient: "linear-gradient(180deg,#0059ff 0%,#003699 100%)", route: "/cliente/tienda/radio" },
  { label: "Mi Carrito",           icon: "",                            iconW: 0,   gradient: "linear-gradient(180deg,#20c25e 0%,#079968 100%)", route: "/cliente/carrito", badge: cliente.totalPiezas || null },
  { label: "Mis Compras",          icon: icon("Registros.png"),         iconW: 68,  gradient: "linear-gradient(180deg,#7cc91a 0%,#1ba547 100%)", route: "/cliente/compras" },
  { label: "Salir",                icon: icon("Salir.png"),             iconW: 84,  gradient: "linear-gradient(180deg,#da2527 0%,#bf133b 100%)", route: null },
])

async function ir(route: string | null) {
  if (route) return router.push(route)
  await auth.logout()
  router.push({ name: "Login" })
}
</script>

<style scoped>
.cli-root { min-height: 100vh; background: #3a2422; display: flex; flex-direction: column; }

.cli-body {
  flex: 1; display: flex; flex-direction: column;
  padding: 12px 100px 16px; gap: 18px; min-height: 0;
}

.cli-bienvenida {
  margin: 0; text-align: center; color: #fff;
  font-family: "Lilita One:Regular", "Lilita One", sans-serif; font-size: 26px;
}

.cli-modulos {
  flex: 1; display: flex; flex-wrap: wrap; justify-content: center; align-content: center;
  gap: 16px; max-width: calc(253px * 5 + 16px * 4); margin: 0 auto;
}

.modulo-btn {
  width: 253px; height: 126px; border: none; border-radius: 10px; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 4px; padding: 8px 8px 10px; box-sizing: border-box;
  transition: filter .15s, transform .1s;
}
.modulo-btn:hover  { filter: brightness(1.1); }
.modulo-btn:active { transform: scale(.97); }
.modulo-icon-wrap { flex: 1; display: flex; align-items: center; justify-content: center; position: relative; }
.modulo-icon { object-fit: contain; display: block; }
.modulo-badge {
  position: absolute; top: 0; right: -14px; min-width: 26px; height: 26px; padding: 0 6px;
  border-radius: 13px; background: #fac73c; color: #3a2422; font: 700 15px/26px "Inter", sans-serif;
}
.modulo-label {
  font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif;
  font-size: 13px; color: #fff; text-align: center; line-height: 1.2; white-space: nowrap;
}

.cli-footer { background: #f8f4e3; height: 50px; flex-shrink: 0; }

@media (max-width: 1279px) {
  .cli-body { padding: 10px 24px 12px; }
}
@media (max-width: 640px) {
  .cli-body { padding: 8px 12px 12px; gap: 12px; }
  .cli-bienvenida { font-size: 18px; }
  .modulo-btn { width: calc(50% - 8px); height: auto; min-height: 100px; }
}
</style>
