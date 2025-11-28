<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps<{ disabled?: boolean; bg?: string; color?: string }>()
const emit = defineEmits<{ (e: 'click'): void }>()
function onClick() {
  if (!props.disabled) emit('click')
}
</script>

<template>
  <button
    class="base-btn"
    :disabled="disabled"
    @click="onClick"
    :style="{
      background: bg,
      color,
    }"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-btn {
  padding: 8px 14px;
  border-radius: 6px;
  background: #4a7af4;
  color: white;
  border: none;
  cursor: pointer;
}

.base-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
