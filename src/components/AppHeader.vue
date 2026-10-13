<template>
  <header class="dash-header">
    <div class="dash-logo">
      <img :src="`${base}Logo.png`" alt="El Diario de Coahuila" class="dash-logo-img" />
    </div>
    <h1 class="dash-title">{{ title }}</h1>
    <div class="dash-user-area">
      <slot name="user" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { inject } from "vue"

defineProps<{ title: string }>()

const base = import.meta.env.BASE_URL
</script>

<style scoped>
.dash-header {
  background: #008a52;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}

.dash-logo { flex-shrink: 0; }

.dash-logo-img {
  width: 296px;
  height: 69px;
  object-fit: contain;
  object-position: left center;
  display: block;
}

.dash-title {
  font-family: "Lilita One:Regular", "Lilita One", sans-serif;
  font-size: 40px;
  font-weight: 400;
  line-height: 100%;
  color: #ffffff;
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

.dash-user-area { position: relative; }

@media (max-width: 1279px) {
  .dash-logo-img { width: clamp(160px, 22vw, 296px); height: auto; }
  .dash-title    { font-size: clamp(24px, 3vw, 40px); }
}

@media (max-width: 640px) {
  .dash-header { padding: 0 12px; height: 80px; }
  .dash-title  { font-size: 22px; }
}
</style>
