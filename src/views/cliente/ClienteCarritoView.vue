<template>
  <div class="cc-root">
    <ClienteHeader title="Mi Carrito" regresar-a="ClienteInicio" :mostrar-carrito="false" />

    <div class="cc-body">
      <!-- Carrito vacío -->
      <div v-if="!cliente.carrito.length && !pedidoOk" class="cc-vacio">
        <p class="cc-vacio-titulo">Tu carrito está vacío</p>
        <p class="cc-vacio-txt">Elige un medio para empezar a comprar tu publicidad.</p>
        <div class="cc-vacio-btns">
          <button class="cc-medio-btn naranja" @click="router.push('/cliente/tienda/periodico')">Comprar en Periódico</button>
          <button class="cc-medio-btn azul" @click="router.push('/cliente/tienda/radio')">Comprar en Radio</button>
        </div>
      </div>

      <div v-else-if="!pedidoOk" class="cc-layout">
        <!-- Columna izquierda -->
        <div class="cc-col">
          <section class="cc-panel">
            <h2 class="cc-panel-titulo">Productos</h2>
            <div v-for="item in cliente.carrito" :key="item.producto.id" class="cc-item">
              <div class="cc-item-info">
                <span class="cc-medio" :class="item.producto.medio">
                  {{ item.producto.medio === "radio" ? "Radio" : "Periódico" }}
                </span>
                <p class="cc-item-nombre">{{ item.producto.nombre }}</p>
                <p class="cc-item-desc">
                  {{ item.producto.descripcion }}<template v-if="item.producto.detalle"> · {{ item.producto.detalle }}</template>
                </p>
                <label class="cc-fecha">
                  Fecha de inicio:
                  <input v-model="item.fechaInicio" type="date" :min="manana" />
                </label>
                <div v-if="item.impresa" class="cc-impresa">
                  <label>Sección<input v-model.trim="item.impresa.seccion" placeholder="-Sección-" /></label>
                  <label>Página<input v-model.trim="item.impresa.pagina" placeholder="-Pág.-" /></label>
                  <label class="full">Fechas de publicación<input v-model.trim="item.impresa.fechasPublicacion" placeholder="-Ej. 10, 17 y 24 de nov-" /></label>
                  <label class="cc-check full">
                    <input v-model="item.impresa.posicionEspecial" type="checkbox" />
                    Solicitar posición especial <small>(costo extra a confirmar por el ejecutivo)</small>
                  </label>
                </div>
              </div>
              <div class="cc-item-ctrl">
                <div class="cc-qty">
                  <button aria-label="Menos" @click="cliente.cambiarCantidad(item.producto.id, -1)">−</button>
                  <span>{{ item.cantidad }}</span>
                  <button aria-label="Más" @click="cliente.cambiarCantidad(item.producto.id, 1)">+</button>
                </div>
                <span class="cc-item-precio">{{ formatoMXN(item.producto.precio * item.cantidad) }}</span>
                <button class="cc-quitar" @click="cliente.quitar(item.producto.id)">Quitar</button>
              </div>
            </div>
            <button class="cc-seguir" @click="router.push('/cliente/tienda/periodico')">+ Seguir comprando</button>
          </section>

          <section class="cc-panel">
            <h2 class="cc-panel-titulo">Datos de facturación</h2>
            <div class="cc-form">
              <label>Nombre o razón social<input v-model.trim="fact.razonSocial" placeholder="-Nombre o empresa-" /></label>
              <label>RFC<input v-model.trim="fact.rfc" placeholder="-RFC-" maxlength="13" @input="fact.rfc = fact.rfc.toUpperCase()" /></label>
              <label>Teléfono<input v-model.trim="fact.telefono" type="tel" placeholder="-10 dígitos-" maxlength="10" /></label>
              <label>Correo<input v-model.trim="fact.correo" type="email" placeholder="-Correo-" /></label>
              <label class="full">Texto o indicaciones del anuncio (opcional)
                <textarea v-model="notas" rows="3" placeholder="-Ej. texto del clasificado, horario preferido del spot…-" />
              </label>
            </div>
          </section>
        </div>

        <!-- Columna derecha: resumen y pago -->
        <aside class="cc-panel cc-resumen">
          <h2 class="cc-panel-titulo">Resumen</h2>
          <div class="cc-linea"><span>Subtotal</span><span>{{ formatoMXN(cliente.subtotal) }}</span></div>
          <div class="cc-linea"><span>IVA (16%)</span><span>{{ formatoMXN(cliente.iva) }}</span></div>
          <div class="cc-linea total"><span>Total</span><span>{{ formatoMXN(cliente.total) }}</span></div>

          <h3 class="cc-sub">Método de pago</h3>
          <div class="cc-metodos">
            <button v-for="m in metodos" :key="m.id" class="cc-metodo" :class="{ activo: metodo === m.id }" @click="metodo = m.id">
              <strong>{{ m.label }}</strong><small>{{ m.desc }}</small>
            </button>
          </div>
          <p class="cc-aviso">Pago simulado — aún no se conecta a una pasarela de pagos.</p>

          <p v-if="error" class="cc-error" role="alert">{{ error }}</p>
          <button class="cc-pagar" :disabled="procesando" @click="pagar">
            <span v-if="procesando" class="cc-spin" />
            {{ procesando ? "Procesando pago..." : `Pagar ${formatoMXN(cliente.total)}` }}
          </button>
        </aside>
      </div>

      <!-- Compra confirmada -->
      <div v-else class="cc-ok">
        <div class="cc-ok-check">✓</div>
        <p class="cc-vacio-titulo">¡Compra realizada!</p>
        <p class="cc-vacio-txt">
          Folio <strong>{{ pedidoOk.folio }}</strong> · {{ formatoMXN(pedidoOk.total) }}<br />
          Un ejecutivo de El Diario revisará tu material y te contactará al {{ pedidoOk.facturacion.telefono }}.
        </p>
        <div class="cc-vacio-btns">
          <button class="cc-medio-btn verde" @click="router.push({ name: 'ClienteCompras' })">Ver mis compras</button>
          <button class="cc-medio-btn naranja" @click="router.push({ name: 'ClienteInicio' })">Ir al inicio</button>
        </div>
      </div>
    </div>

    <div class="cc-footer" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import ClienteHeader from "@/components/ClienteHeader.vue"
import { useClienteStore, type Pedido } from "@/stores/cliente"
import { useAuthStore } from "@/stores/auth"
import { formatoMXN } from "@/data/catalogoCliente"

const router = useRouter()
const cliente = useClienteStore()
const auth = useAuthStore()

const d = new Date(); d.setDate(d.getDate() + 1)
const manana = d.toISOString().slice(0, 10)

const fact = reactive({ razonSocial: "", rfc: "", telefono: "", correo: auth.cliente?.email ?? "" })
const notas = ref("")
const metodos = [
  { id: "Tarjeta",       label: "Tarjeta",       desc: "Crédito o débito" },
  { id: "Transferencia", label: "Transferencia", desc: "SPEI" },
  { id: "OXXO",          label: "OXXO",          desc: "Pago en efectivo" },
]
const metodo = ref("Tarjeta")
const error = ref("")
const procesando = ref(false)
const pedidoOk = ref<Pedido | null>(null)

function validar() {
  if (!fact.razonSocial) return "Ingresa tu nombre o razón social."
  if (!/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test(fact.rfc)) return "El RFC no es válido (12 o 13 caracteres)."
  if (!/^\d{10}$/.test(fact.telefono)) return "El teléfono debe tener 10 dígitos."
  if (!/^\S+@\S+\.\S+$/.test(fact.correo)) return "Ingresa un correo válido."
  if (cliente.carrito.some((i) => !i.fechaInicio || i.fechaInicio < manana)) return "Revisa las fechas de inicio (a partir de mañana)."
  if (cliente.carrito.some((i) => i.impresa && !i.impresa.seccion)) return "Indica la sección para tu publicidad impresa."
  return ""
}

async function pagar() {
  error.value = validar()
  if (error.value) return
  procesando.value = true
  await new Promise((r) => setTimeout(r, 1200)) // simula la pasarela
  pedidoOk.value = cliente.confirmarCompra({ metodoPago: metodo.value, facturacion: { ...fact }, notas: notas.value })
  procesando.value = false
}
</script>

<style scoped>
.cc-root { min-height: 100vh; background: #3a2422; display: flex; flex-direction: column; }
.cc-body { flex: 1; padding: 20px 40px 28px; display: flex; justify-content: center; }

.cc-layout { width: 100%; max-width: 1200px; display: grid; grid-template-columns: 1fr 360px; gap: 20px; align-items: start; }
.cc-col { display: flex; flex-direction: column; gap: 20px; }

.cc-panel { background: #f8f4e3; border-radius: 10px; padding: 18px 20px; border-top: 8px solid #008a52; }
.cc-panel-titulo {
  margin: 0 0 12px; font-family: "Lilita One:Regular", "Lilita One", sans-serif;
  font-weight: 400; font-size: 26px; color: #3a2422;
}
.cc-sub { margin: 18px 0 8px; font: 700 15px "Inter", sans-serif; color: #3a2422; }

/* Items */
.cc-item { display: flex; justify-content: space-between; gap: 16px; padding: 12px 0; border-bottom: 1px dashed #d8d1bd; }
.cc-item-info { display: flex; flex-direction: column; gap: 3px; }
.cc-medio { align-self: flex-start; border-radius: 5px; padding: 2px 8px; color: #fff; font: 600 11px "Inter", sans-serif; }
.cc-medio.periodico { background: linear-gradient(180deg,#fa8c3c,#ef4743); }
.cc-medio.radio { background: linear-gradient(180deg,#0059ff,#003699); }
.cc-item-nombre { margin: 0; font-family: "Lilita One:Regular", "Lilita One", sans-serif; font-size: 20px; color: #3a2422; }
.cc-item-desc { margin: 0; color: #666; font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif; font-size: 14px; }
.cc-fecha { font: 500 13px "Inter", sans-serif; color: #444; display: flex; align-items: center; gap: 8px; margin-top: 4px; }
.cc-fecha input { border: 1px solid #c9c2ad; border-radius: 6px; padding: 4px 6px; font: inherit; background: #fff; }
.cc-item-ctrl { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
.cc-qty { display: flex; align-items: center; border: 2px solid #008a52; border-radius: 8px; overflow: hidden; }
.cc-qty button { width: 32px; height: 30px; border: none; background: #008a52; color: #fff; font-size: 18px; cursor: pointer; }
.cc-qty span { min-width: 36px; text-align: center; font: 700 15px "Inter", sans-serif; }
.cc-item-precio { font-family: "Oswald", sans-serif; font-weight: 700; font-size: 20px; color: #008a52; }
.cc-quitar { background: none; border: none; color: #d92525; cursor: pointer; font: 600 13px "Inter", sans-serif; }
.cc-seguir { margin-top: 12px; background: none; border: 2px dashed #008a52; color: #008a52; border-radius: 8px; padding: 8px 14px; cursor: pointer; font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif; font-size: 15px; }

/* Datos de publicidad impresa */
.cc-impresa { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 10px; margin-top: 6px; max-width: 420px; }
.cc-impresa label { display: flex; flex-direction: column; gap: 2px; font: 600 12px "Inter", sans-serif; color: #444; }
.cc-impresa label.full { grid-column: 1 / -1; }
.cc-impresa input:not([type="checkbox"]) { border: 1px solid #c9c2ad; border-radius: 6px; padding: 5px 8px; font: 400 13px "Inter", sans-serif; background: #fff; }
.cc-impresa .cc-check { flex-direction: row; align-items: center; gap: 6px; font-weight: 500; }
.cc-impresa .cc-check input { accent-color: #008a52; width: 16px; height: 16px; }
.cc-impresa small { color: #888; font-weight: 400; }

/* Formulario (mismo look que el login) */
.cc-form { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 16px; }
.cc-form label { display: flex; flex-direction: column; gap: 4px; font: 600 13px "Inter", sans-serif; color: #3a2422; }
.cc-form label.full { grid-column: 1 / -1; }
.cc-form input, .cc-form textarea {
  border: 1px solid #c9c2ad; border-radius: 8px; padding: 9px 10px; background: #fff;
  font: 400 15px "Inter", sans-serif; resize: vertical;
}
.cc-form input:focus, .cc-form textarea:focus { outline: 2px solid #20c25e; border-color: transparent; }

/* Resumen */
.cc-resumen { position: sticky; top: 16px; }
.cc-linea { display: flex; justify-content: space-between; padding: 6px 0; font: 500 15px "Inter", sans-serif; color: #444; }
.cc-linea.total { border-top: 2px solid #3a2422; margin-top: 6px; padding-top: 10px; font-family: "Oswald", sans-serif; font-weight: 700; font-size: 24px; color: #008a52; }
.cc-metodos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.cc-metodo { background: #fff; border: 2px solid #d8d1bd; border-radius: 8px; padding: 8px 4px; cursor: pointer; display: flex; flex-direction: column; gap: 2px; color: #3a2422; }
.cc-metodo strong { font: 700 13px "Inter", sans-serif; }
.cc-metodo small { font: 400 11px "Inter", sans-serif; color: #777; }
.cc-metodo.activo { border-color: #008a52; background: #e6f5ec; }
.cc-aviso { margin: 8px 0 0; font: 400 12px "Inter", sans-serif; color: #888; }
.cc-error { margin: 12px 0 0; color: #d92525; font: 600 13px "Inter", sans-serif; }
.cc-pagar {
  width: 100%; margin-top: 14px; height: 54px; border: none; border-radius: 10px; cursor: pointer;
  background: linear-gradient(180deg,#20c25e 0%,#079968 100%); color: #fff;
  font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif; font-size: 20px;
  display: flex; align-items: center; justify-content: center; gap: 10px;
}
.cc-pagar:hover:not(:disabled) { filter: brightness(1.1); }
.cc-pagar:disabled { opacity: .7; cursor: wait; }
.cc-spin { width: 18px; height: 18px; border: 3px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Vacío / OK */
.cc-vacio, .cc-ok { align-self: center; text-align: center; background: #f8f4e3; border-radius: 12px; padding: 36px 40px; max-width: 560px; }
.cc-vacio-titulo { margin: 0 0 8px; font-family: "Lilita One:Regular", "Lilita One", sans-serif; font-size: 32px; color: #3a2422; }
.cc-vacio-txt { margin: 0 0 20px; font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif; font-size: 17px; color: #555; }
.cc-vacio-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.cc-medio-btn { border: none; border-radius: 10px; padding: 12px 20px; color: #fff; cursor: pointer; font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif; font-size: 16px; }
.cc-medio-btn:hover { filter: brightness(1.1); }
.cc-medio-btn.naranja { background: linear-gradient(180deg,#fa8c3c,#ef4743); }
.cc-medio-btn.azul { background: linear-gradient(180deg,#0059ff,#003699); }
.cc-medio-btn.verde { background: linear-gradient(180deg,#20c25e,#079968); }
.cc-ok-check { width: 72px; height: 72px; margin: 0 auto 12px; border-radius: 50%; background: #20c25e; color: #fff; font-size: 40px; line-height: 72px; }

.cc-footer { background: #f8f4e3; height: 50px; flex-shrink: 0; }

@media (max-width: 960px) {
  .cc-layout { grid-template-columns: 1fr; }
  .cc-resumen { position: static; }
}
@media (max-width: 600px) {
  .cc-body { padding: 12px; }
  .cc-form { grid-template-columns: 1fr; }
  .cc-item { flex-direction: column; }
  .cc-item-ctrl { flex-direction: row; align-items: center; justify-content: space-between; }
}
</style>
