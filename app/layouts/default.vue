<script setup lang="ts">
/**
 * default.vue — Root Nuxt Layout
 * Provides: global nav and the DOM content wrapper.
 */
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)

function onScroll() {
  isScrolled.value = window.scrollY > 60
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <!-- Navigation (DOM Overlay) -->
  <nav class="nav" :class="{ 'nav--scrolled': isScrolled }" aria-label="Main navigation">
    <span class="nav__logo" aria-label="ANI 3D">ANI<span style="color: var(--clr-accent-2)">·</span>3D</span>
    <ul class="nav__links" role="list">
      <li><a href="#hero-section" class="nav__link" id="nav-hero">Experience</a></li>
      <li><a href="#process-section" class="nav__link" id="nav-process">Process</a></li>
      <li><a href="#showcase-section" class="nav__link" id="nav-showcase">Showcase</a></li>
    </ul>
  </nav>

  <!-- Page Content (DOM Overlay Wrapper) -->
  <div class="dom-overlay">
    <slot />
  </div>
</template>

<style scoped>
.dom-overlay {
  position: relative;
  z-index: 10;
  width: 100%;
  pointer-events: none; /* Let events pass through to canvas underneath by default */
}

/* Re-enable pointer events on interactive children in global css */
</style>
