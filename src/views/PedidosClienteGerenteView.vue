<template>
  <div class="pedidos-root">
    <AppHeader title="Pedidos de clientes">
      <template #user>
        <button class="regresar-btn" @click="router.push({ name: 'DashboardGerente' })">
          <span aria-hidden="true">←</span> Menú gerente
        </button>
      </template>
    </AppHeader>

    <main class="pedidos-main">
      <div class="pedidos-toolbar">
        <div>
          <h1>Pedidos recibidos</h1>
          <p>{{ pedidosFiltrados.length }} pedidos</p>
        </div>
        <label class="buscar-wrap">
          <span class="sr-only">Buscar pedidos</span>
          <input v-model="busqueda" type="search" placeholder="Buscar folio, cliente o correo" />
        </label>
      </div>

      <p v-if="error" class="estado estado-error" role="alert">{{ error }}</p>
      <p v-else-if="cargando" class="estado">Cargando pedidos...</p>
      <div v-else-if="pedidosFiltrados.length === 0" class="estado estado-vacio">
        {{ busqueda ? "No hay pedidos que coincidan con la búsqueda." : "Aún no hay pedidos de clientes." }}
      </div>

      <section v-else class="lista-pedidos" aria-label="Pedidos de clientes">
        <article v-for="pedido in pedidosFiltrados" :key="pedido.id" class="pedido">
          <button class="pedido-resumen" :aria-expanded="abierto === pedido.id" @click="abierto = abierto === pedido.id ? null : pedido.id">
            <span class="pedido-identidad">
              <strong>{{ pedido.folio }}</strong>
              <small>{{ pedido.cliente_nombre }} · {{ pedido.cliente_email }}</small>
            </span>
            <span class="pedido-fecha">{{ fecha(pedido.created_at) }}</span>
            <span class="pedido-estado" :class="claseEstado(pedido.estado)">{{ pedido.estado }}</span>
            <strong class="pedido-total">{{ formatoMXN(Number(pedido.total)) }}</strong>
            <span class="chevron" :class="{ abierto: abierto === pedido.id }" aria-hidden="true">⌄</span>
          </button>

          <div v-if="abierto === pedido.id" class="pedido-detalle">
            <div class="datos-cliente">
              <span><b>Facturar a:</b> {{ pedido.facturacion.razonSocial || "—" }}</span>
              <span><b>RFC:</b> {{ pedido.facturacion.rfc || "—" }}</span>
              <span><b>Teléfono:</b> {{ pedido.facturacion.telefono || "—" }}</span>
              <span><b>Pago:</b> {{ pedido.metodo_pago }}</span>
            </div>
            <div class="tabla-scroll">
              <table>
                <thead><tr><th>Producto</th><th>Medio</th><th>Fecha solicitada</th><th>Cantidad</th><th>Importe</th></tr></thead>
                <tbody>
                  <tr v-for="item in pedido.items" :key="item.producto.id">
                    <td>
                      {{ item.producto.nombre }}
                      <small v-if="item.impresa"> · Sección {{ item.impresa.seccion || "—" }} / Pág. {{ item.impresa.pagina || "—" }}</small>
                    </td>
                    <td>{{ item.producto.medio === "radio" ? "Radio" : "Periódico" }}</td>
                    <td>{{ item.fechaInicio }}</td>
                    <td>{{ item.cantidad }}</td>
                    <td>{{ formatoMXN(item.producto.precio * item.cantidad) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="pedido-pie">
              <p v-if="pedido.notas"><b>Indicaciones:</b> {{ pedido.notas }}</p>
              <div class="montos">
                <span>Subtotal {{ formatoMXN(Number(pedido.subtotal)) }}</span>
                <span>IVA {{ formatoMXN(Number(pedido.iva)) }}</span>
                <strong>Total {{ formatoMXN(Number(pedido.total)) }}</strong>
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
    <footer class="pedidos-footer" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import AppHeader from "@/components/AppHeader.vue"
import { pedidoClienteService, type PedidoAdministracion } from "@/services/pedidoClienteService"
import { formatoMXN } from "@/data/catalogoCliente"

const router = useRouter()
const pedidos = ref<PedidoAdministracion[]>([])
const cargando = ref(true)
const error = ref("")
const busqueda = ref("")
const abierto = ref<string | null>(null)

const pedidosFiltrados = computed(() => {
  const consulta = busqueda.value.trim().toLocaleLowerCase("es-MX")
  if (!consulta) return pedidos.value
  return pedidos.value.filter((pedido) =>
    [pedido.folio, pedido.cliente_nombre, pedido.cliente_email]
      .some((valor) => valor.toLocaleLowerCase("es-MX").includes(consulta)),
  )
})

const fecha = (valor: string) => new Date(valor).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })
const claseEstado = (estado: string) => ({ revision: estado === "En revisión", pagado: estado === "Pagado", publicado: estado === "Publicado" })

onMounted(async () => {
  try {
    pedidos.value = await pedidoClienteService.listarTodos()
  } catch (e) {
    error.value = e instanceof Error ? e.message : "No se pudieron cargar los pedidos."
  } finally {
    cargando.value = false
  }
})
</script>

<style scoped>
.pedidos-root { min-height: 100vh; display: flex; flex-direction: column; background: #3a2422; }
.pedidos-main { width: min(1180px, calc(100% - 40px)); margin: 0 auto; padding: 28px 0 36px; flex: 1; }
.pedidos-toolbar { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 20px; color: #f8f4e3; }
.pedidos-toolbar h1 { margin: 0; font: 400 30px "Lilita One:Regular", sans-serif; }
.pedidos-toolbar p { margin: 4px 0 0; font: 14px "Baloo Paaji:Regular", sans-serif; opacity: .8; }
.buscar-wrap input { width: min(360px, 42vw); min-height: 42px; padding: 8px 12px; border: 1px solid #d8d1bd; border-radius: 6px; background: #fff; font: 14px "Inter", sans-serif; }
.regresar-btn { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border: 0; border-radius: 6px; background: #d92525; color: #fff; cursor: pointer; font: 16px "Baloo Paaji:Regular", sans-serif; }
.lista-pedidos { display: flex; flex-direction: column; gap: 10px; }
.pedido { overflow: hidden; border-left: 6px solid #008a52; border-radius: 6px; background: #f8f4e3; }
.pedido-resumen { display: grid; width: 100%; grid-template-columns: minmax(200px, 1fr) minmax(140px, auto) auto auto 24px; align-items: center; gap: 16px; padding: 14px 18px; border: 0; background: transparent; color: #3a2422; text-align: left; cursor: pointer; }
.pedido-identidad { display: flex; min-width: 0; flex-direction: column; }
.pedido-identidad strong { font: 20px "Lilita One:Regular", sans-serif; }
.pedido-identidad small { overflow: hidden; color: #6a6862; text-overflow: ellipsis; white-space: nowrap; font: 13px "Inter", sans-serif; }
.pedido-fecha { color: #65625b; font: 13px "Inter", sans-serif; }
.pedido-estado { padding: 4px 9px; border-radius: 5px; background: #fac73c; color: #3a2422; white-space: nowrap; font: 700 12px "Inter", sans-serif; }
.pedido-estado.pagado { background: #079968; color: #fff; }
.pedido-estado.publicado { background: #0059ff; color: #fff; }
.pedido-total { color: #008a52; white-space: nowrap; font: 700 20px "Oswald", sans-serif; }
.chevron { font-size: 24px; transition: transform .15s; }
.chevron.abierto { transform: rotate(180deg); }
.pedido-detalle { padding: 0 18px 16px; }
.datos-cliente { display: flex; flex-wrap: wrap; gap: 8px 24px; padding: 4px 0 12px; color: #48463f; font: 13px "Inter", sans-serif; }
.tabla-scroll { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; color: #333; font: 13px "Inter", sans-serif; }
th { padding: 9px 10px; background: #008a52; color: white; text-align: left; }
td { padding: 9px 10px; border-bottom: 1px solid #ddd6c5; }
td small { color: #777; }
.pedido-pie { display: flex; justify-content: space-between; gap: 18px; flex-wrap: wrap; padding-top: 12px; color: #48463f; font: 13px "Inter", sans-serif; }
.pedido-pie p { margin: 0; max-width: 600px; }
.montos { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; white-space: nowrap; }
.montos strong { color: #008a52; font: 700 18px "Oswald", sans-serif; }
.estado { padding: 24px; border-radius: 6px; background: #f8f4e3; color: #3a2422; font: 15px "Inter", sans-serif; }
.estado-error { color: #a11b26; }
.pedidos-footer { height: 50px; background: #f8f4e3; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; }
@media (max-width: 760px) {
  .pedidos-main { width: calc(100% - 24px); padding-top: 18px; }
  .pedidos-toolbar { align-items: stretch; flex-direction: column; }
  .buscar-wrap input { width: 100%; box-sizing: border-box; }
  .pedido-resumen { grid-template-columns: minmax(0, 1fr) auto; gap: 8px 12px; padding: 12px; }
  .pedido-fecha { grid-column: 1; grid-row: 2; }
  .pedido-estado { grid-column: 2; grid-row: 1; }
  .pedido-total { grid-column: 1; grid-row: 3; }
  .chevron { grid-column: 2; grid-row: 2 / span 2; justify-self: center; }
  .pedido-detalle { padding: 0 12px 14px; }
}
</style>
