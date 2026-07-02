<script setup lang="ts">
import { shallowRef, watchEffect, onUnmounted, onMounted } from 'vue'
import { PerspectiveCamera, Group } from 'three'
import { useCinematicScroll } from '~/composables/useCinematicScroll'
import ParticleSwarm from './ParticleSwarm.vue'
import GlassDispersion from './GlassDispersion.vue'

const cameraRef = shallowRef<PerspectiveCamera | null>(null)
const sceneGroupRef = shallowRef<Group | null>(null)

const { setupMouseTracking, setupCameraChoreography, startTicker, cleanup } = useCinematicScroll()

onMounted(() => {
  const cleanupMouse = setupMouseTracking()
  startTicker()
  
  // We need to wait for refs to be populated by TresJS
  const unwatch = watchEffect(() => {
    if (cameraRef.value && sceneGroupRef.value) {
      setupCameraChoreography(cameraRef.value, sceneGroupRef.value)
      unwatch()
    }
  })

  onUnmounted(() => {
    cleanupMouse()
    cleanup()
  })
})
</script>

<template>
  <TresCanvas
    window-size
    alpha
    antialias
    :clear-color="'transparent'"
    class="cinematic-canvas"
  >
    <TresPerspectiveCamera 
      ref="cameraRef" 
      :position="[0, 0, 5]" 
      :fov="60" 
      make-default 
    />
    
    <TresAmbientLight :intensity="1.5" />
    <TresDirectionalLight :position="[5, 5, 5]" :intensity="3" color="#6c2bd9" />
    <TresDirectionalLight :position="[-5, -5, -5]" :intensity="2" color="#00d4ff" />

    <TresGroup ref="sceneGroupRef">
      <!-- Particle Fluid Hero Environment -->
      <ParticleSwarm />
      
      <!-- Showcase Refraction Element (Positioned far below, reached via scroll) -->
      <GlassDispersion />
    </TresGroup>
  </TresCanvas>
</template>

<style scoped>
.cinematic-canvas {
  position: fixed !important;
  inset: 0;
  z-index: 0;
  pointer-events: none; /* Crucial: Let DOM clicks pass through */
}
</style>
