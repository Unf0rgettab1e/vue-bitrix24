<script setup lang="ts">
import readme from '../../README.md?raw'
import { marked } from 'marked'

const html = marked(readme)
</script>

<template>
  <div class="about">
    <div v-html="html" class="prose"></div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    padding: 60px 0 80px;
  }
}
</style>
