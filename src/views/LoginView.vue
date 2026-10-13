<template>
  <div class="login-root">

    <!-- Left panel: building photo -->
    <div class="login-photo-panel" aria-hidden="true">
      <img src="/loginedificio.png" alt="" class="login-photo-img" />
      <div class="login-photo-overlay" />
    </div>

    <!-- Right panel: form -->
    <div class="login-form-panel">
      <!-- Header verde con logo -->
      <header class="login-header">
        
        <img
          :src="'/Logo.png'"
          alt="El Diario de Coahuila"
          class="login-logo-img"
          width="296"
          height="69"
          @error="onLogoError"
          ref="logoImg"
        />
        <div class="login-logo-placeholder" ref="logoPlaceholder" style="display:none">
          EL DIARIO
        </div>
      </header>

      <!-- Card del formulario -->
      <main class="login-card-wrapper">
        <div class="login-card">
          <div class="login-card-title-bar">
            <h1 class="login-title">Iniciar Sesión</h1>
          </div>

          <form class="login-form" @submit.prevent="handleLogin" novalidate>
            <div class="form-group">
              <label for="email" class="form-label">Usuario</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="-Correo Empresarial-"
                class="form-input"
                autocomplete="username"
                :disabled="loading"
              />
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Contraseña</label>
              <div class="input-password-wrap">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="-Contraseña-"
                  class="form-input"
                  autocomplete="current-password"
                  :disabled="loading"
                />
                <button type="button" class="btn-ojo" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Ocultar contraseña' : 'Ver contraseña'">
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
            </div>

            <p v-if="errorMsg" class="form-error" role="alert">{{ errorMsg }}</p>
          </form>
        </div>

        <button
          class="login-submit-btn"
          :disabled="loading"
          @click="handleLogin"
        >
          <span v-if="loading" class="btn-spinner" aria-hidden="true" />
          {{ loading ? "Verificando..." : "Iniciar Sesión" }}
        </button>

        <button class="forgot-password-btn" type="button" @click="handleForgotPassword">
          ¿Olvidaste tu contraseña?
        </button>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, useTemplateRef } from "vue"
import { useRouter } from "vue-router"
import { authService } from "@/services/authService"
import { useAuthStore } from "@/stores/auth"

const router = useRouter()
const authStore = useAuthStore()
const baseUrl = import.meta.env.BASE_URL

const logoImg = ref<HTMLImageElement | null>(null)
const logoPlaceholder = ref<HTMLDivElement | null>(null)

function onLogoError() {
  if (logoImg.value) logoImg.value.style.display = "none"
  if (logoPlaceholder.value) logoPlaceholder.value.style.display = "block"
}


const form = reactive({ email: "", password: "" })
const loading = ref(false)
const showPassword = ref(false)
const errorMsg = ref("")

async function handleLogin() {
  errorMsg.value = ""

  if (!form.email || !form.password) {
    errorMsg.value = "Por favor ingresa tu correo y contraseña."
    return
  }

  loading.value = true
  try {
    const { supabaseConfigured } = await import("@/lib/supabase")
    if (supabaseConfigured) {
      await authStore.login(form.email, form.password)
    }
    // Redirigir según el rol del empleado autenticado
    const rol = authStore.rolActual
    if (rol === "Gerente" || rol === "Administrador") {
      router.push({ name: "DashboardGerente" })
    } else {
      router.push({ name: "Dashboard" })
    }
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : "Credenciales incorrectas."
  } finally {
    loading.value = false
  }
}

function handleForgotPassword() {
  // Pendiente: flujo de recuperación de contraseña
  alert("Contacta al administrador del sistema para recuperar tu contraseña.")
}
</script>

<style scoped>
/* ════════════════════════════════════════════════════════════
   SISTEMA DE BREAKPOINTS — referencia Figma: 1280 × 720 px
   ────────────────────────────────────────────────────────────
   < 640px   → móvil: sin foto, formulario centrado
   640–1023px → tablet: sin foto, formulario centrado con max-width
   1024–1279px → desktop compacto: layout split adaptado
   ≥ 1280px   → desktop objetivo: proporciones exactas del Figma
   ════════════════════════════════════════════════════════════ */

/* ── Layout raíz ─────────────────────────────────────────── */
.login-root {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  background: #c8c0b0;
}

/* ── Panel izquierdo (foto — fondo completo) ─────────────── */
.login-photo-panel {
  position: absolute;
  inset: 0;
  width: 50%;
  background-color: #c8c0b0;
  overflow: hidden;
  z-index: 0;
}
.login-photo-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.login-photo-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.02) 100%);
}

/* ── Panel derecho: base móvil (< 640px) ────────────────── */
.login-form-panel {
  position: relative;
  width: 100%;
  min-height: 100vh;
  clip-path: none;
  background: #f0ede5;
  display: flex;
  flex-direction: column;
  z-index: 1;
}

/* ── Tablet (640px – 1023px) ─────────────────────────────── */
@media (min-width: 640px) and (max-width: 1023px) {
  .login-photo-panel {
    display: none;
  }
  .login-form-panel {
    position: relative;
    width: 100%;
    clip-path: none;
    min-height: 100vh;
  }
  .login-header {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  .login-card-wrapper {
    padding: 2.5rem 2rem;
  }
}

/* ── Desktop compacto (1024px – 1279px) ──────────────────── */
@media (min-width: 1024px) and (max-width: 1279px) {
  .login-form-panel {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 64%;
    min-height: unset;
    /* Diagonal ligeramente menos pronunciada para pantalla más estrecha */
    clip-path: polygon(14% 0, 100% 0, 100% 100%, 0 100%);
  }
  .login-header {
    padding-left: 12%;
    padding-right: 2rem;
  }
  .login-card-wrapper {
    padding: 2.5rem 2.5rem 2.5rem 7%;
  }
}

/* ── Desktop objetivo ≥ 1280px — proporciones exactas Figma ─
   Figma: 1280×720. Foto ≈ 550px (43%), Form ≈ 845px (66%)
   con diagonal que recorta ~18% del panel desde arriba      */
@media (min-width: 1280px) {
  .login-root {
    min-height: 720px; /* altura mínima igual al frame de Figma */
  }
  .login-form-panel {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 66%;           /* 845px / 1280px ≈ 66% */
    min-height: unset;
    clip-path: polygon(18% 0, 100% 0, 100% 100%, 0 100%);
  }
  .login-header {
    height: 80px;
    padding-left: 14%;
    padding-right: 2.5rem;
  }
  .login-card-wrapper {
    padding: 3rem 3rem 3rem 8%;
  }
}

/* ── Header verde con logo (heredada la diagonal del panel padre) ── */
.login-header {
  background: #1f7a38;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 2rem;
  padding-right: 2rem;
  flex-shrink: 0;
}

/* ── Logo imagen — dimensiones exactas del Figma ─────────────
   Figma: width 296px × height 69px, dentro de header de 80px
   (top: 14px desde el borde superior del header)             */
.login-logo-img {
  width: 296px;
  height: 69px;
  object-fit: contain;
  object-position: left center;
  flex-shrink: 0;
}

/* Fallback de texto mientras no exista el asset */
.login-logo-placeholder {
  font-family: 'Oswald', sans-serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

/* Escala proporcional en pantallas menores a 1280px */
@media (max-width: 1279px) {
  .login-logo-img {
    width: clamp(180px, 23vw, 296px);
    height: auto;
  }
}

@media (max-width: 640px) {
  .login-logo-img {
    width: clamp(140px, 50vw, 240px);
    height: auto;
  }
}

/* ── Wrapper del card ─────────────────────────────────────── */
.login-card-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  gap: 1.25rem;
}

/* ── Card del formulario ─────────────────────────────────── */
.login-card {
  width: 100%;
  max-width: 420px;
  background: #e4e0d6;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.login-card-title-bar {
  background: #1f7a38;
  padding: 1rem 1.5rem;
}

/* Annotation 2 — h1 "Iniciar Sesión" */
.login-title {
  font-family: 'Baloo Paaji 2', sans-serif;
  font-size: 25px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0%;
  text-align: center;
  color: #ffffff;
  margin: 0;
}

.login-form {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ── Campos ──────────────────────────────────────────────── */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

/* Annotation 3 — labels "Usuario" y "Contraseña" */
.form-label {
  font-family: 'Baloo Paaji 2', sans-serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0%;
  color: #2d2d2d;
}

/* Annotation 4 — inputs email y password */
.form-input {
  width: 100%;
  padding: 0.65rem 0.875rem;
  font-family: 'Baloo Paaji 2', sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0%;
  color: #2d2d2d;
  background: #ffffff;
  border: 1.5px solid #c8c0b0;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: #a09898;
  font-style: italic;
}

.form-input:focus {
  border-color: #1f7a38;
  box-shadow: 0 0 0 3px rgba(31, 122, 56, 0.15);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-password-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.input-password-wrap .form-input {
  padding-right: 2.5rem;
}
.btn-ojo {
  position: absolute;
  right: 0.6rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #a09898;
  display: flex;
  align-items: center;
  padding: 0;
  line-height: 1;
}
.btn-ojo:hover { color: #1f7a38; }

/* ── Error ───────────────────────────────────────────────── */
.form-error {
  font-size: 0.8rem;
  color: #c0392b;
  margin: 0;
  padding: 0 0.25rem;
}

/* Annotation 5 — botón "Iniciar Sesión" */
.login-submit-btn {
  width: 100%;
  max-width: 420px;
  padding: 0.85rem 1.5rem;
  background: #1f7a38;
  color: #ffffff;
  font-family: 'Baloo Paaji 2', sans-serif;
  font-size: 25px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0%;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.login-submit-btn:hover:not(:disabled) {
  background: #165c2a;
}

.login-submit-btn:active:not(:disabled) {
  transform: scale(0.99);
}

.login-submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* ── Spinner ─────────────────────────────────────────────── */
.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Annotation 6 — "¿Olvidaste tu contraseña?" */
.forgot-password-btn {
  background: none;
  border: none;
  font-family: 'Baloo Paaji 2', sans-serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0%;
  color: #1f7a38;
  cursor: pointer;
  padding: 0.25rem;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.15s;
}

.forgot-password-btn:hover {
  color: #165c2a;
}

/* ── Botón de alternancia de modo (esquina inferior derecha) ─
   Posición igual a Figma: left 1265 / top 705 en canvas 1280×720
   → flush bottom-right del contenedor raíz                    */
.login-modo-toggle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 15px;
  height: 15px;
  border: none;
  border-radius: 0;
  cursor: pointer;
  z-index: 10;
  padding: 0;
  transition: filter 0.12s;
}
.login-modo-toggle:hover { filter: brightness(1.15); }
.login-modo-usuario { background: #008a52; }
.login-modo-admin   { background: #d92525; }
</style>
