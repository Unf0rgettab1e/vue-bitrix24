<script lang="ts" setup>
defineProps<{ percent: number }>()
</script>

<template>
  <div class="progress-container">
    <div class="progress-bar" :style="{ width: percent + '%' }"></div>
  </div>
</template>

<style scoped>
.progress-container {
  width: 100%;
  background: #eee;
  height: 10px;
  border-radius: 5px;
}

.progress-bar {
  height: 100%;
  background: #3a6ff7;
  border-radius: 5px;
  transition: width 0.3s;
}
</style>
