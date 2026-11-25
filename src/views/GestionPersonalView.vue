<template>
  <div class="gp-page">
    <AppHeader title="Gestión de personal">
      <template #user>
        <button type="button" class="gp-button gp-back" @click="regresar">
          <img :src="`${base}assets/regresar-icon.png`" alt="" />
          <span>Regresar</span>
        </button>
      </template>
    </AppHeader>
    <main class="gp-main">
      <div class="gp-heading">
        <div>
          <p class="gp-description">Consulta y administra los empleados de El Diario.</p>
        </div>
        <button type="button" class="gp-button gp-primary gp-add" @click="abrirAgregar"><span aria-hidden="true" class="gp-plus">+</span> Agregar</button>
      </div>
      <section class="gp-panel" aria-labelledby="lista-personal">
        <div class="gp-toolbar">
          <div class="gp-list-title"><h2 id="lista-personal">Empleados</h2><span v-if="!cargando && !errorCarga" class="gp-count">{{ empleados.length }}</span></div>
          <div class="gp-search">
            <label for="buscar-empleado" class="gp-sr-only">Buscar por nombre o correo</label>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></svg>
            <input id="buscar-empleado" v-model="busqueda" type="search" placeholder="Buscar por nombre o correo…" />
          </div>
        </div>
        <div class="gp-table-scroll" role="region" aria-label="Tabla de empleados" tabindex="0" :aria-busy="cargando">
          <table>
            <caption class="gp-sr-only">Listado de empleados y acciones de gestión</caption>
            <thead><tr><th scope="col">Nombre</th><th scope="col">Correo</th><th scope="col">Teléfono</th><th scope="col" class="gp-actions-heading">Acciones</th></tr></thead>
            <tbody>
              <tr v-for="empleado in (!cargando && !errorCarga ? empleadosPagina : [])" :key="empleado.id" class="gp-data-row">
                <th scope="row" class="gp-name">{{ empleado.nombre }}</th>
                <td class="gp-email">{{ empleado.email }}</td>
                <td :class="{ 'gp-muted': !empleado.telefono.trim() }">{{ empleado.telefono.trim() || "Sin teléfono" }}</td>
                <td><div class="gp-actions">
                  <button type="button" class="gp-button gp-edit" :aria-label="'Editar a ' + empleado.nombre" @click="abrirEditar(empleado)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m15 5 4 4M4 20l4-1 12-12a2.8 2.8 0 0 0-4-4L4 15l-1 6Z" /></svg>Editar
                  </button>
                  <button type="button" class="gp-button gp-delete" :aria-label="'Eliminar a ' + empleado.nombre" @click="confirmarEliminar(empleado)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" /></svg>Eliminar
                  </button>
                </div></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="cargando" class="gp-empty"><p role="status">Cargando empleados…</p></div>
        <div v-else-if="errorCarga" class="gp-empty"><p role="alert">{{ errorCarga }}</p><button type="button" class="gp-button gp-secondary" @click="cargarEmpleados">Reintentar</button></div>
        <div v-else-if="!empleadosFiltrados.length" class="gp-empty">
          <p role="status">{{ busqueda.trim() ? "No se encontraron coincidencias" : "No hay registros disponibles" }}</p>
          <span>{{ busqueda.trim() ? "Prueba con otro nombre o correo." : "Agrega un empleado para comenzar." }}</span>
          <button v-if="busqueda.trim()" type="button" class="gp-button gp-secondary" @click="busqueda = ''">Limpiar búsqueda</button>
        </div>
        <footer class="gp-pagination">
          <p v-if="cargando" aria-live="polite">Cargando…</p>
          <p v-else-if="errorCarga">Lista no disponible</p>
          <p v-else aria-live="polite">Mostrando {{ primerRegistro }}–{{ ultimoRegistro }} de {{ empleadosFiltrados.length }} empleados</p>
          <nav aria-label="Paginación de empleados">
            <button type="button" class="gp-page-button" aria-label="Página anterior" :disabled="pagina <= 1 || cargando || !!errorCarga" @click="pagina--"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg></button>
            <span class="gp-current-page" aria-current="page" :aria-label="'Página ' + pagina + ' de ' + totalPaginas">{{ pagina }}</span>
            <button type="button" class="gp-page-button" aria-label="Página siguiente" :disabled="pagina >= totalPaginas || cargando || !!errorCarga" @click="pagina++"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg></button>
          </nav>
        </footer>
      </section>
    </main>
    <dialog ref="dialogo" class="gp-dialog" aria-labelledby="titulo-modal-personal" @cancel.prevent="cerrarModal">
      <div class="gp-dialog-header"><h2 id="titulo-modal-personal">{{ tituloModal }}</h2><button type="button" class="gp-close" aria-label="Cerrar modal" @click="cerrarModal">×</button></div>
      <form v-if="showAgregar" class="gp-form" @submit.prevent="guardarEmpleado">
        <label>Nombre completo<input v-model="nuevoEmpleado.nombre" autocomplete="name" required autofocus /></label>
        <label>Correo electrónico<input v-model="nuevoEmpleado.email" type="email" autocomplete="email" required /></label>
        <label>Teléfono<input v-model="nuevoEmpleado.telefono" type="tel" autocomplete="tel" required /></label>
        <label>Contraseña<input v-model="nuevoEmpleado.password" type="password" autocomplete="new-password" required /></label>
        <div class="gp-dialog-actions"><button type="button" class="gp-button gp-secondary" @click="cerrarModal">Cancelar</button><button type="submit" class="gp-button gp-primary">Guardar empleado</button></div>
      </form>
      <form v-else-if="showEditar" class="gp-form" @submit.prevent="guardarEdicion">
        <label>Nombre completo<input v-model="empleadoEditar.nombre" autocomplete="name" required autofocus /></label>
        <label>Rol<select v-model="empleadoEditar.rol"><option value="Vendedor">Vendedor</option><option value="Gerente">Gerente</option><option value="Administrador">Administrador</option></select></label>
        <div class="gp-dialog-actions"><button type="button" class="gp-button gp-secondary" @click="cerrarModal">Cancelar</button><button type="submit" class="gp-button gp-primary">Guardar cambios</button></div>
      </form>
      <div v-else-if="showEliminar.show" class="gp-form">
        <p class="gp-confirmation">¿Deseas eliminar a <strong>{{ showEliminar.nombre }}</strong> de la lista de empleados activos?</p>
        <p class="gp-description">El empleado quedará desactivado.</p>
        <div class="gp-dialog-actions"><button type="button" class="gp-button gp-secondary" autofocus @click="cerrarModal">Cancelar</button><button type="button" class="gp-button gp-danger" @click="eliminarEmpleado">Eliminar empleado</button></div>
      </div>
    </dialog>
    <div class="gp-footer" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { useRouter } from "vue-router"
import AppHeader from "@/components/AppHeader.vue"

const router = useRouter()
const base = import.meta.env.BASE_URL

// Estado de empleados
type RolEmpleado = "Vendedor" | "Gerente" | "Administrador"

interface Empleado {
  id: string
  nombre: string
  email: string
  telefono: string
  rol: RolEmpleado
}

const empleados = ref<Empleado[]>([])

// Búsqueda y paginación de la tabla.
const POR_PAGINA = 8
const pagina = ref(1)
const busqueda = ref("")
const cargando = ref(true)
const errorCarga = ref("")
const empleadosFiltrados = computed(() => {
  const termino = busqueda.value.trim().toLocaleLowerCase("es")
  return empleados.value.filter(e =>
    e.nombre.toLocaleLowerCase("es").includes(termino) ||
    e.email.toLocaleLowerCase("es").includes(termino)
  )
})
const totalPaginas = computed(() => Math.max(1, Math.ceil(empleadosFiltrados.value.length / POR_PAGINA)))
const empleadosPagina = computed(() => empleadosFiltrados.value.slice((pagina.value - 1) * POR_PAGINA, pagina.value * POR_PAGINA))
const primerRegistro = computed(() => empleadosFiltrados.value.length ? (pagina.value - 1) * POR_PAGINA + 1 : 0)
const ultimoRegistro = computed(() => Math.min(pagina.value * POR_PAGINA, empleadosFiltrados.value.length))
watch(busqueda, () => { pagina.value = 1 }, { flush: "sync" })
watch(totalPaginas, total => { pagina.value = Math.min(pagina.value, total) })

// Modal Agregar
const showAgregar = ref(false)

const nuevoEmpleado = ref({
  nombre: "",
  email: "",
  telefono: "",
  password: "",
})

function abrirAgregar() {
  showAgregar.value = true
}

function resetForm() {
  nuevoEmpleado.value = {
    nombre: "",
    email: "",
    telefono: "",
    password: "",
  }
}

function cerrarAgregar() {
  showAgregar.value = false
  resetForm()
}

async function guardarEmpleado() {
  const { nombre, email, telefono, password } = nuevoEmpleado.value

  if (!nombre.trim() || !email.trim() || !telefono.trim() || !password.trim()) {
    alert("Completa todos los campos.")
    return
  }

  try {
    const { supabase } = await import("@/lib/supabase")

    const { data, error } = await supabase.functions.invoke("crear-empleado", {
      body: {
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        password,
        rol: "Vendedor",
      },
    })

    if (error) {
      throw new Error(error.message || "No se pudo registrar el empleado.")
    }

    if (data?.error) {
      throw new Error(data.error)
    }

    const empleadoCreado = data?.empleado

    if (!empleadoCreado) {
      throw new Error("No se recibió la información del empleado.")
    }

    const nuevoRegistro: Empleado = {
      id: empleadoCreado.id,
      nombre: empleadoCreado.nombre,
      email: empleadoCreado.email,
      telefono: telefono.trim(),
      rol: empleadoCreado.rol ?? "Vendedor",
    }

    empleados.value.push(nuevoRegistro)

    busqueda.value = ""
    pagina.value = totalPaginas.value

    alert("Empleado registrado correctamente.")
    cerrarAgregar()
  } catch (e) {
    console.error("Error guardando empleado:", e)
    alert(e instanceof Error ? e.message : "Error al registrar el empleado.")
  }
}

// Modal Editar
const showEditar = ref(false)

const empleadoEditar = ref({
  id: "",
  nombre: "",
  rol: "Vendedor" as RolEmpleado,
})

function abrirEditar(emp: Empleado) {
  const original = empleados.value.find(e => e.id === emp.id)

  if (!original) return

  empleadoEditar.value = {
    id: original.id,
    nombre: original.nombre,
    rol: original.rol,
  }

  showEditar.value = true
}

async function guardarEdicion() {
  const { id, nombre, rol } = empleadoEditar.value

  if (!nombre.trim()) {
    alert("Ingresa el nombre del empleado.")
    return
  }

  try {
    const { empleadoService } = await import("@/services/empleadoService")

    const empleadoActualizado = await empleadoService.actualizar(id, {
      nombre: nombre.trim(),
      rol,
    })

    const empleado = empleados.value.find(e => e.id === id)

    if (empleado) {
      empleado.nombre = empleadoActualizado.nombre
      empleado.rol = empleadoActualizado.rol
    }

    alert("Empleado actualizado correctamente.")
    showEditar.value = false
  } catch (e) {
    console.error("Error actualizando empleado:", e)
    alert(e instanceof Error ? e.message : "Error al actualizar el empleado.")
  }
}

// Modal Eliminar
const showEliminar = ref<{
  show: boolean
  id: string
  nombre: string
}>({
  show: false,
  id: "",
  nombre: "",
})

function confirmarEliminar(emp: Empleado) {
  showEliminar.value = {
    show: true,
    id: emp.id,
    nombre: emp.nombre,
  }
}

async function eliminarEmpleado() {
  try {
    const { empleadoService } = await import("@/services/empleadoService")

    await empleadoService.desactivar(showEliminar.value.id)

    empleados.value = empleados.value.filter(
      e => e.id !== showEliminar.value.id
    )

    showEliminar.value = {
      show: false,
      id: "",
      nombre: "",
    }

    if (pagina.value > totalPaginas.value) {
      pagina.value = totalPaginas.value
    }

    alert("Empleado desactivado correctamente.")
  } catch (e) {
    console.error("Error desactivando empleado:", e)
    alert(e instanceof Error ? e.message : "Error al desactivar el empleado.")
  }
}

// Navegación
function regresar() {
  router.push({ name: "DashboardGerente" })
}

// El diálogo nativo gestiona el foco y el cierre con Escape.
const dialogo = ref<HTMLDialogElement | null>(null)
const modalActivo = computed(() => showAgregar.value ? "agregar" : showEditar.value ? "editar" : showEliminar.value.show ? "eliminar" : "")
const tituloModal = computed(() => modalActivo.value === "agregar" ? "Agregar empleado" : modalActivo.value === "editar" ? "Editar empleado" : "Eliminar empleado")
function cerrarModal() {
  if (showAgregar.value) cerrarAgregar()
  showEditar.value = false
  showEliminar.value.show = false
}
watch(modalActivo, activo => {
  if (activo && !dialogo.value?.open) dialogo.value?.showModal()
  if (!activo && dialogo.value?.open) dialogo.value?.close()
}, { flush: "post" })

// Se conserva la consulta existente; solo se adapta su presentación.
async function cargarEmpleados() {
  cargando.value = true
  errorCarga.value = ""
  try {
    const { empleadoService } = await import("@/services/empleadoService")
    const data = await empleadoService.listarActivos()
    empleados.value = data.map(e => ({
      id: e.id,
      nombre: e.nombre,
      email: e.email,
      telefono: e.telefono ?? "",
      rol: e.rol as RolEmpleado,
    }))
  } catch (e) {
    console.error("Error cargando empleados:", e)
    errorCarga.value = "No fue posible cargar la lista de empleados."
  } finally {
    cargando.value = false
  }
}
onMounted(cargarEmpleados)
</script>

<style scoped>
.gp-page { min-height: 100vh; background: #3a2422; color: #3a2422; display: flex; flex-direction: column; font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif; }
.gp-page *, .gp-page *::before, .gp-page *::after { box-sizing: border-box; }
.gp-main { width: 100%; max-width: 1280px; margin: 0 auto; padding: 32px 40px 44px; flex: 1; }
.gp-heading { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-bottom: 28px; }
.gp-description { margin: 0; color: #f8f4e3; font-size: 17px; line-height: 1.5; }
.gp-button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 42px; padding: 8px 16px; border: 1px solid transparent; border-radius: 8px; font: inherit; font-size: 15px; cursor: pointer; white-space: nowrap; transition: filter .15s, background-color .15s; }
.gp-button:hover:enabled { filter: brightness(1.08); }
.gp-button svg, .gp-button img { width: 22px; height: 22px; flex-shrink: 0; object-fit: contain; }
.gp-primary { background: #008a52; color: white; }
.gp-primary:hover { background: #00663b; }
.gp-add { min-height: 44px; padding-inline: 20px; }
.gp-plus { font-size: 22px; font-weight: 400; line-height: 1; }
.gp-back { color: white; background: #d92525; }
.gp-panel { background: #f8f4e3; border: 3px solid #1e1e1e; border-radius: 7px; box-shadow: 10px 0 10px rgba(0,0,0,.25); overflow: hidden; }
.gp-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 22px 24px; }
.gp-list-title { display: flex; align-items: center; gap: 10px; }
h2 { margin: 0; font-family: "Lilita One:Regular", "Lilita One", sans-serif; font-size: 22px; font-weight: 400; }
.gp-count { min-width: 28px; padding: 3px 8px; border-radius: 6px; color: #3a2422; background: #f7e05e; font-size: 13px; text-align: center; }
.gp-search { width: 280px; max-width: 100%; display: flex; align-items: center; gap: 8px; border: 1px solid #c9c2ad; border-radius: 7px; padding: 0 10px; color: #615d5d; background: #fff; }
.gp-search > svg { width: 14px; height: 14px; flex: 0 0 14px; }
.gp-search input { width: 100%; min-width: 0; height: 42px; border: 0; background: transparent; color: #3a2422; font: inherit; font-size: 14px; outline: none; }
.gp-search:focus-within { outline: 2px solid #008a52; outline-offset: 2px; }
.gp-table-scroll { width: 100%; overflow-x: auto; }
table { width: 100%; min-width: 760px; border-collapse: collapse; font-size: 15px; text-align: left; }
thead { background: #fff; }
thead th { padding: 14px 24px; border-block: 1px solid #d8d1bd; color: #615d5d; font-size: 14px; font-weight: 400; }
tbody td, tbody th { padding: 16px 24px; border-bottom: 1px solid #e5deca; line-height: 1.5; }
tbody tr:last-child td, tbody tr:last-child th { border-bottom: 0; }
.gp-data-row { background: #fff; }
.gp-data-row:hover { background: #fffbea; }
.gp-name { min-width: 180px; max-width: 320px; font-weight: 700; overflow-wrap: anywhere; }
.gp-email { color: #615d5d; max-width: 330px; overflow-wrap: anywhere; }
.gp-muted { color: #888; }
.gp-actions-heading { text-align: right; }
.gp-actions { display: flex; justify-content: flex-end; gap: 8px; }
.gp-edit { background: #e8f4ec; border-color: #c3dfcd; color: #00663b; }
.gp-edit:hover { background: #d9eddf; }
.gp-delete { background: #fff0ed; border-color: #f2c9c2; color: #b4232d; }
.gp-delete:hover { background: #ffe1dc; }
.gp-empty { min-height: 260px; padding: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #59665e; }
.gp-empty p { margin: 0 0 8px; font-weight: 600; }
.gp-empty span { display: block; font-size: 13px; }
.gp-empty .gp-button { margin-top: 16px; }
.gp-pagination { display: flex; align-items: center; justify-content: space-between; gap: 16px; border-top: 1px solid #d8d1bd; padding: 16px 24px; }
.gp-pagination p { margin: 0; color: #615d5d; font-size: 13px; }
.gp-pagination nav { display: flex; align-items: center; gap: 7px; }
.gp-page-button, .gp-current-page { width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #c9c2ad; border-radius: 7px; font: inherit; font-size: 14px; background: white; color: #3a2422; }
.gp-page-button { cursor: pointer; }
.gp-page-button:hover:enabled { background: #f7e05e; }
.gp-page-button:disabled { opacity: .35; cursor: not-allowed; }
.gp-current-page { background: #008a52; border-color: #00663b; color: white; font-weight: 700; }
button:focus-visible, .gp-table-scroll:focus-visible, .gp-form input:focus-visible, .gp-form select:focus-visible { outline: 2px solid #008a52; outline-offset: 3px; }
.gp-dialog { position: fixed; inset: 0; margin: auto; width: min(520px, calc(100% - 32px)); max-height: calc(100dvh - 32px); padding: 0; border: 3px solid #1e1e1e; border-radius: 8px; background: #f8f4e3; color: #3a2422; box-shadow: 0 20px 80px #0008; overflow-y: auto; }
.gp-dialog::backdrop { background: #18291fc0; }
.gp-dialog-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; border-bottom: 1px solid #d8d1bd; padding: 20px 24px; }
.gp-close { width: 36px; height: 36px; background: #d92525; border: 0; border-radius: 6px; font-size: 24px; cursor: pointer; color: white; }
.gp-dialog .gp-description { margin-top: 10px; color: #615d5d; font-size: 14px; }
.gp-form { padding: 24px; }
.gp-form label { display: flex; flex-direction: column; gap: 7px; margin-bottom: 18px; font-size: 13px; font-weight: 600; }
.gp-form input, .gp-form select { width: 100%; padding: 11px 12px; border: 1px solid #c9c2ad; border-radius: 6px; background: white; color: #3a2422; font: inherit; font-size: 16px; font-weight: 400; }
.gp-dialog-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 10px; margin-top: 28px; }
.gp-secondary { background: white; color: #3a2422; border-color: #c9c2ad; }
.gp-secondary:hover { background: #fffbea; }
.gp-danger { background: #d92525; color: white; }
.gp-danger:hover { background: #b91f1f; }
.gp-confirmation { margin: 0; line-height: 1.6; overflow-wrap: anywhere; }
.gp-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
.gp-footer { height: 50px; flex-shrink: 0; background: #f8f4e3; }
@media (max-width: 640px) {
  .gp-page :deep(.dash-header) { gap: 8px; padding: 0 12px; }
  .gp-page :deep(.dash-logo-img) { width: 112px; height: auto; }
  .gp-page :deep(.dash-title) { position: static; transform: none; flex: 1; font-size: 18px; text-align: center; white-space: normal; }
  .gp-page :deep(.dash-user-area) { flex-shrink: 0; }
  .gp-main { padding: 24px 16px 32px; }
  .gp-heading { gap: 12px; align-items: flex-start; }
  .gp-add { padding-inline: 12px; }
  .gp-description { font-size: 13px; }
  .gp-toolbar { align-items: stretch; flex-direction: column; padding: 18px 16px; gap: 14px; }
  .gp-search { width: 100%; }
  .gp-search input { font-size: 16px; }
  .gp-pagination { padding: 16px; flex-wrap: wrap; }
  .gp-pagination nav { margin-left: auto; }
  .gp-dialog-header, .gp-form { padding: 20px; }
}
</style>
