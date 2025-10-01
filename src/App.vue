<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style scoped>
:global(html) {
  height: 100%;
}

:global(body) {
  min-height: 100%;
}

:global(#app) {
  min-height: 100vh;
}
</style>
