<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  page: number
  total: number
  pageSize?: number
  onChange: (page: number) => void
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 10,
  showPageSizeSelector: false,
})

const space = computed(() => '•••')

const len = computed(() => Math.ceil(props.total / props.pageSize))

const first = computed(() => {
  if (props.page < 3 || len.value <= 5) return 0
  if (props.page + 2 >= len.value) return len.value - 5
  return props.page - 2
})

const btns = computed(() =>
  Array.from({ length: Math.min(len.value, 5) }, (_, i) => first.value + i),
)

const leftClickHandler = () => {
  if (props.page > 0) props.onChange(props.page - 1)
}

const rightClickHandler = () => {
  if (props.page < len.value - 1) props.onChange(props.page + 1)
}
</script>

<template>
  <div class="pagination">
    <button class="pagination__slide" @click="leftClickHandler" :disabled="page === 0">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M10.828 12L15.778 16.95L14.364 18.364L8 12L14.364 5.63599L15.778 7.04999L10.828 12Z"
        />
      </svg>
    </button>

    <template v-if="page >= 3 && len > 5">
      <button class="pagination__btn" @click="() => onChange(0)" :disabled="page === 0">1</button>

      <span v-if="first > 1">{{ space }}</span>
    </template>

    <button
      v-for="n in btns"
      :key="n"
      class="pagination__btn"
      @click="() => onChange(n)"
      :disabled="page === n"
    >
      {{ n + 1 }}
    </button>

    <template v-if="page + 3 < len && len > 5">
      <span v-if="first + 6 < len">{{ space }}</span>

      <button class="pagination__btn" @click="() => onChange(len - 1)" :disabled="page === len - 1">
        {{ len }}
      </button>
    </template>

    <button class="pagination__slide" @click="rightClickHandler" :disabled="page === len - 1">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M13.1722 12L8.22217 7.04999L9.63617 5.63599L16.0002 12L9.63617 18.364L8.22217 16.95L13.1722 12Z"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #787878;
  column-gap: 0.5rem;
  font-size: smaller;
}

.pagination__btn,
.pagination__slide {
  min-width: 1.8rem;
  height: 1.8rem;
  border: 1px solid#787878;
  border-radius: 20px;
  color: #fff;
  background-color: #2b2b2b;
  cursor: pointer;
  outline: none;
  transition:
    border-color 0.25s linear,
    background-color 0.25s linear;
}

.pagination__slide {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.pagination__btn {
  padding: 0 0.5rem;
}

@media (hover: hover) {
  .pagination__slide:hover,
  .pagination__btn:hover {
    border-color: #929292;
    background-color: #3a3a3a;
  }
}

.pagination__btn:disabled {
  background-color: #4a4a4a;
  pointer-events: none;
}

.pagination__slide:disabled {
  color: #5e5e5e;
  pointer-events: none;
}
</style>
