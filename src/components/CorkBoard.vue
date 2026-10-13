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
                {{ stat.loading ? "…" : stat.value !== undefined ? String(stat.value).padStart(2, "0") : "--" }}
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
</script>

<style scoped>
.dash-registros-section { flex-shrink: 0; }

.cork-board {
  background: #615d5d;
  border: 3px solid #1e1e1e;
  border-radius: 7px;
  box-shadow: 10px 0 10px rgba(0, 0, 0, 0.25);
  height: 270px;
  display: flex;
  flex-direction: column;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
  padding: 16px 32px;
}

.postit-wrapper {
  width: 178px;
  height: 203px;
  background: #f8f4e3;
  border-bottom-right-radius: 15px;
  border-bottom-left-radius: 15px;
  box-shadow: 10px 0 4px 0 rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.postit-card {
  position: relative;
  width: 122px;
  height: 132px;
  background: #f6e782;
  border: 1px solid #d6c24a;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
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
  margin: 0;
}

.postit-value {
  font-family: "Baloo Paaji:Regular", "Baloo Paaji 2", sans-serif;
  font-size: 36px;
  font-weight: 400;
  line-height: 1;
  text-align: center;
  color: #615d5d;
  margin: 0;
  padding-top: 4px;
}

@media (max-width: 1279px) {
  .cork-board     { height: auto; }
  .postits-row    { flex-wrap: wrap; padding: 16px; }
  .postit-wrapper { width: 150px; height: 172px; }
  .postit-card    { width: 104px; height: 112px; }
  .postit-value   { font-size: 30px; }
  .postit-label   { font-size: 14px; }
}

@media (max-width: 640px) {
  .postits-row    { gap: 10px; }
  .postit-wrapper { width: 120px; height: 145px; }
  .postit-card    { width: 90px; height: 98px; }
  .postit-value   { font-size: 26px; }
  .postit-label   { font-size: 12px; }
}
</style>
