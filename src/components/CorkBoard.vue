<template>
  <section class="dash-registros-section">
    <div class="cork-board">
      <div class="registros-banner">
        <span class="registros-banner-text">{{ bannerText }}</span>
      </div>
      <div class="postits-row">
        <div v-for="stat in stats" :key="stat.id" class="postit-wrapper">
          <div class="postit-card">
            <div class="postit-tab" />
            <div class="postit-body">
              <p class="postit-label">{{ stat.label }}</p>
              <p class="postit-value">
                {{ stat.loading ? "…" : stat.value !== undefined ? formatValue(stat.value) : "--" }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  bannerText: string
  stats: Array<{
    id: string
    label: string
    value?: number
    loading?: boolean
  }>
}>()

function formatValue(value: number): string {
  if (Number.isInteger(value)) return String(value).padStart(2, "0")
  return new Intl.NumberFormat("es-MX", { maximumFractionDigits: 2 }).format(value)
}
</script>

<style scoped>
.dash-registros-section { flex-shrink: 0; min-width: 0; }

.cork-board {
  background: #615d5d;
  border: 3px solid #1e1e1e;
  border-radius: 7px;
  box-shadow: 10px 0 10px rgba(0, 0, 0, 0.25);
  min-height: 270px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.registros-banner {
  background: #f7e05e;
  border: 1px solid #c8c135;
  border-radius: 0 0 15px 15px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.registros-banner-text {
  font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
  color: #615d5d;
}

.postits-row {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr));
  align-content: center;
  align-items: stretch;
  gap: 14px;
  padding: 18px;
  min-width: 0;
}

.postit-wrapper {
  min-width: 0;
  min-height: 180px;
  background: #f8f4e3;
  border-bottom-right-radius: 15px;
  border-bottom-left-radius: 15px;
  box-shadow: 10px 0 4px 0 rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  box-sizing: border-box;
}

.postit-card {
  position: relative;
  width: calc(100% - 20px);
  min-height: 132px;
  background: #f6e782;
  border: 1px solid #d6c24a;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.postit-tab {
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  width: 74px;
  height: 16px;
  background: rgba(255, 255, 255, 0.698);
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  border-radius: 2px 2px 0 0;
}

.postit-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6px 8px 8px;
  gap: 2px;
}

.postit-label {
  font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
  color: #615d5d;
  white-space: pre-line;
  overflow-wrap: anywhere;
  max-width: 100%;
  margin: 0;
}

.postit-value {
  font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif;
  font-size: 30px;
  font-weight: 400;
  line-height: 1.05;
  text-align: center;
  color: #615d5d;
  margin: 0;
  padding-top: 4px;
  max-width: 100%;
  overflow-wrap: anywhere;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 1279px) {
  .cork-board     { min-height: 0; }
  .postits-row    { padding: 16px; }
  .postit-wrapper { min-height: 160px; }
  .postit-card    { min-height: 116px; }
  .postit-label   { font-size: 14px; }
}

@media (max-width: 640px) {
  .postits-row    { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; padding: 12px; }
  .postit-wrapper { min-height: 138px; }
  .postit-card    { width: calc(100% - 14px); min-height: 98px; }
  .postit-value   { font-size: 26px; }
  .postit-label   { font-size: 12px; }
}
</style>
