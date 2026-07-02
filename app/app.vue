<script setup lang="ts">
/**
 * app.vue — Root application shell.
 * Nuxt 4 uses app.vue as the root, pages are rendered via <NuxtPage>.
 * Here we inject the global Cinematic Canvas behind everything.
 */
import CinematicCanvas from '~/components/scene/CinematicCanvas.vue'
</script>

<template>
  <div id="app-root">
    <!-- Global WebGL Background Layer (Fixed, z-index: 0, pointer-events: none) -->
    <CinematicCanvas />
    
    <!-- DOM Layer (Pages) -->
    <NuxtPage />
  </div>
</template>

<style>
#app-root {
  min-height: 100vh;
  position: relative;
}
</style>
