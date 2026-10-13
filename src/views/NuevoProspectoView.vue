<template>
  <div class="np-root">

    <!-- ── HEADER ─────────────────────────────────────────── -->
    <header class="np-header">
      <div class="np-logo">
        <img :src="`${base}Logo.png`" alt="El Diario de Coahuila" class="np-logo-img" />
      </div>

      <h1 class="np-title">Nuevo Prospecto</h1>

      <button class="np-regresar-btn" @click="regresar">
        <img :src="`${base}assets/regresar-icon.png`" alt="" class="np-regresar-icon" />
        <span>Regresar</span>
      </button>
    </header>

    <!-- ── CUERPO ──────────────────────────────────────────── -->
    <div class="np-body">
      <div class="np-notebook">

        <!-- Panel izquierdo: Datos del contacto -->
        <div class="np-book-outer">
          <div class="np-book-inner">
            <div class="np-section-header">
              <h2 class="np-section-title">Datos del contacto</h2>
              <div class="np-green-line" />
            </div>

            <div class="np-fields">
              <div class="np-field-group">
                <label class="np-label">Nombre del contacto</label>
                <input
                  v-model="form.nombre_contacto"
                  type="text"
                  placeholder="-Ingrese el nombre-"
                  class="np-input"
                  :class="{ 'np-input--error': errors.nombre_contacto }"
                />
                <span class="np-hint" :class="{ 'np-hint--error': errors.nombre_contacto }">
                  {{ errors.nombre_contacto || 'Este campo es obligatorio' }}
                </span>
              </div>

              <div class="np-field-group">
                <label class="np-label">Cargo o puesto de marketing</label>
                <input
                  v-model="form.cargo"
                  type="text"
                  placeholder="-Ingrese el cargo o puesto-"
                  class="np-input"
                  :class="{ 'np-input--error': errors.cargo }"
                />
                <span class="np-hint" :class="{ 'np-hint--error': errors.cargo }">
                  {{ errors.cargo || 'Este campo es obligatorio' }}
                </span>
              </div>

              <div class="np-field-group">
                <label class="np-label">Teléfono</label>
                <input
                  v-model="form.telefono"
                  type="tel"
                  placeholder="-Digite el numero-"
                  class="np-input"
                  :class="{ 'np-input--error': errors.telefono }"
                />
                <span class="np-hint" :class="{ 'np-hint--error': errors.telefono }">
                  {{ errors.telefono || 'Este campo es obligatorio' }}
                </span>
              </div>

              <div class="np-field-group">
                <label class="np-label">Correo electrónico</label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="-Ingrese el correo electronico-"
                  class="np-input"
                  :class="{ 'np-input--error': errors.email }"
                />
                <span class="np-hint" :class="{ 'np-hint--error': errors.email }">
                  {{ errors.email || 'Este campo es obligatorio' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Espiral central -->
        <div class="np-spiral" aria-hidden="true">
          <img
            v-for="n in 8"
            :key="n"
            :src="`${base}assets/be45e.png`"
            alt=""
            class="np-ring"
          />
        </div>

        <!-- Panel derecho: Datos de la empresa -->
        <div class="np-book-outer">
          <div class="np-book-inner">
            <div class="np-section-header">
              <h2 class="np-section-title">Datos de la empresa</h2>
              <div class="np-green-line" />
            </div>

            <div class="np-fields">
              <div class="np-field-group">
                <label class="np-label">Nombre de la empresa o marca</label>
                <input
                  v-model="form.nombre_empresa"
                  type="text"
                  placeholder="-Ingrese el nombre-"
                  class="np-input"
                  :class="{ 'np-input--error': errors.nombre_empresa }"
                />
                <span class="np-hint" :class="{ 'np-hint--error': errors.nombre_empresa }">
                  {{ errors.nombre_empresa || 'Este campo es obligatorio' }}
                </span>
              </div>

              <div class="np-field-group">
                <label class="np-label">Página web</label>
                <input
                  v-model="form.pagina_web"
                  type="text"
                  placeholder="-Ingrese el dominio-"
                  class="np-input"
                  :class="{ 'np-input--error': errors.pagina_web }"
                />
                <span class="np-hint" :class="{ 'np-hint--error': errors.pagina_web }">
                  {{ errors.pagina_web || 'Este campo es obligatorio' }}
                </span>
              </div>

              <div class="np-field-group np-field-group--grow">
                <label class="np-label">Domicilio</label>
                <textarea
                  v-model="form.domicilio"
                  placeholder="-Ingrese la direccion-"
                  class="np-input np-textarea"
                  :class="{ 'np-input--error': errors.domicilio }"
                />
                <span class="np-hint" :class="{ 'np-hint--error': errors.domicilio }">
                  {{ errors.domicilio || 'Este campo es obligatorio' }}
                </span>
              </div>
            </div>

            <!-- Botón Guardar -->
            <div class="np-guardar-row">
              <p v-if="errorGeneral" class="np-error-general">{{ errorGeneral }}</p>
              <button class="np-guardar-btn" :disabled="saving" @click="guardar">
                <img :src="`${base}assets/guardar-icon.png`" alt="" class="np-guardar-icon" />
                <span>{{ saving ? 'Guardando…' : 'Guardar' }}</span>
              </button>
            </div>
          </div>
        </div>

      </div><!-- /.np-notebook -->
    </div><!-- /.np-body -->

    <!-- ── FOOTER ──────────────────────────────────────────── -->
    <div class="np-footer" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"
import { prospectoService } from "@/services/prospectoService"

const router = useRouter()
const authStore = useAuthStore()
const base = import.meta.env.BASE_URL

const saving = ref(false)
const errorGeneral = ref("")

const form = reactive({
  nombre_contacto: "",
  cargo: "",
  telefono: "",
  email: "",
  nombre_empresa: "",
  pagina_web: "",
  domicilio: "",
})

const errors = reactive({
  nombre_contacto: "",
  cargo: "",
  telefono: "",
  email: "",
  nombre_empresa: "",
  pagina_web: "",
  domicilio: "",
})

function validar(): boolean {
  errors.nombre_contacto = form.nombre_contacto.trim() ? "" : "Este campo es obligatorio"
  errors.cargo           = form.cargo.trim()           ? "" : "Este campo es obligatorio"
  errors.telefono        = form.telefono.trim()        ? "" : "Este campo es obligatorio"
  errors.email           = form.email.trim()           ? "" : "Este campo es obligatorio"
  errors.nombre_empresa  = form.nombre_empresa.trim()  ? "" : "Este campo es obligatorio"
  errors.pagina_web      = form.pagina_web.trim()      ? "" : "Este campo es obligatorio"
  errors.domicilio       = form.domicilio.trim()       ? "" : "Este campo es obligatorio"
  return Object.values(errors).every(v => v === "")
}

async function guardar() {
  errorGeneral.value = ""
  if (!validar()) return

  saving.value = true
  try {
    await prospectoService.crear({
      nombre_empresa:      form.nombre_empresa,
      nombre_contacto:     form.nombre_contacto,
      cargo_contacto:      form.cargo || null,
      telefono:            form.telefono || null,
      email_contacto:      form.email || null,
      pagina_web:          form.pagina_web || null,
      domicilio:           form.domicilio || null,
      estado:              "Prospecto",
      id_empleado_registro: authStore.empleado?.id ?? null,
    })
    router.push({ name: "Dashboard" })
  } catch (e: unknown) {
    errorGeneral.value = e instanceof Error ? e.message : "Error al guardar. Intenta de nuevo."
  } finally {
    saving.value = false
  }
}

function regresar() {
  router.push({ name: "Dashboard" })
}
</script>

<style scoped>
/* ── Raíz ─────────────────────────────────────────────────── */
.np-root {
  min-height: 100vh;
  background: #3a2422;
  display: flex;
  flex-direction: column;
}

/* ── Header ──────────────────────────────────────────────── */
.np-header {
  background: #008a52;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
  position: relative;
}

.np-logo { flex-shrink: 0; }

.np-logo-img {
  width: 296px;
  height: 69px;
  object-fit: contain;
  object-position: left center;
  display: block;
}

.np-title {
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

.np-regresar-btn {
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
.np-regresar-btn:hover { filter: brightness(1.1); }

.np-regresar-icon {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

/* ── Cuerpo ──────────────────────────────────────────────── */
.np-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 40px;
}

/* ── Notebook (dos paneles + espiral) ───────────────────── */
.np-notebook {
  display: flex;
  align-items: stretch;
  gap: 0;
  width: 100%;
  max-width: 1080px;
}

/* ── Panel externo gris (sombra de cuaderno) ────────────── */
.np-book-outer {
  flex: 1;
  background: #615d5d;
  border: 3px solid #1e1e1e;
  border-radius: 7px;
  box-shadow: 10px 0 10px rgba(0,0,0,0.25);
  padding: 12px;
  display: flex;
}

/* ── Panel interno crema ─────────────────────────────────── */
.np-book-inner {
  flex: 1;
  background: #f8f4e3;
  border: 3px solid #1e1e1e;
  border-radius: 7px;
  padding: 20px 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── Encabezado de sección ──────────────────────────────── */
.np-section-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.np-section-title {
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 25px;
  font-weight: 400;
  color: #000000;
  margin: 0;
  text-align: center;
}

.np-green-line {
  width: 100%;
  height: 10px;
  background: #008a52;
  border-radius: 10px;
}

/* ── Campos ──────────────────────────────────────────────── */
.np-fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.np-field-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.np-field-group--grow { flex: 1; }
.np-field-group--grow .np-input { flex: 1; min-height: 80px; }

.np-label {
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 20px;
  font-weight: 400;
  color: #000000;
  line-height: 1.2;
}

.np-input {
  width: 100%;
  background: #f8f4e3;
  border: 4px solid #c8c135;
  border-radius: 15px;
  padding: 10px 14px;
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 20px;
  color: #615d5d;
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
  resize: none;
}

.np-input:focus { border-color: #008a52; }
.np-input--error { border-color: #c0392b; }

.np-textarea {
  resize: vertical;
  min-height: 80px;
}

.np-hint {
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 15px;
  color: #615d5d;
  line-height: 1.2;
}

.np-hint--error { color: #c0392b; }

/* ── Espiral central ─────────────────────────────────────── */
.np-spiral {
  width: 68px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 12px 0;
}

.np-ring {
  width: 67.5px;
  height: 67.5px;
  object-fit: contain;
}

/* ── Botón Guardar ───────────────────────────────────────── */
.np-guardar-row {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  margin-top: auto;
}

.np-error-general {
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 14px;
  color: #c0392b;
  margin: 0;
  text-align: right;
}

.np-guardar-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #008a52;
  border: none;
  border-radius: 3px;
  padding: 0 20px;
  height: 45px;
  cursor: pointer;
  font-family: 'Baloo Paaji:Regular', 'Baloo Paaji 2', sans-serif;
  font-size: 20px;
  color: #ffffff;
  transition: filter 0.15s;
  min-width: 141px;
  justify-content: center;
}

.np-guardar-btn:hover:not(:disabled) { filter: brightness(1.1); }
.np-guardar-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.np-guardar-icon {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

/* ── Footer ──────────────────────────────────────────────── */
.np-footer {
  background: #f8f4e3;
  height: 50px;
  flex-shrink: 0;
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 900px) {
  .np-notebook { flex-direction: column; }
  .np-spiral {
    flex-direction: row;
    width: 100%;
    height: 50px;
    padding: 0 12px;
  }
  .np-ring { width: 40px; height: 40px; }
  .np-logo-img { width: clamp(140px, 22vw, 296px); height: auto; }
  .np-title { font-size: clamp(22px, 3vw, 40px); }
}

@media (max-width: 600px) {
  .np-header { padding: 0 12px; height: 80px; }
  .np-regresar-btn { padding: 0 14px; font-size: 18px; }
  .np-title { font-size: 20px; }
  .np-body { padding: 10px 12px; }
  .np-label { font-size: 17px; }
  .np-input { font-size: 16px; }
}
</style>
