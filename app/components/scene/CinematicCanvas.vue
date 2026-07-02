<script setup lang="ts">
import { shallowRef, watch, onMounted } from 'vue'
import { PerspectiveCamera, PCFSoftShadowMap, SRGBColorSpace } from 'three'
import { useTresContext } from '@tresjs/core'
import { PointerLockControls } from '@tresjs/cientos'
import { useRealEstateStore } from '~/stores/realEstateStore'
import { useFirstPersonController } from '~/composables/useFirstPersonController'

import ApartmentModel from './ApartmentModel.vue'
import LightingSystem from './LightingSystem.vue'

const store = useRealEstateStore()
const cameraRef = shallowRef<PerspectiveCamera | null>(null)
const controlsRef = shallowRef<any>(null)

// Configure Renderer for realism
const gl = {
  clearColor: '#87CEEB', // Sky blue
  shadows: true,
  alpha: false,
  shadowMapType: PCFSoftShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMappingExposure: 1.2,
  antialias: true
}

// Initialize custom WASD controller once context is ready
const onReady = () => {
  if (cameraRef.value) {
    useFirstPersonController(cameraRef.value)
  }
}
</script>

<template>
  <TresCanvas v-bind="gl" @ready="onReady" class="cinematic-canvas">
    <TresPerspectiveCamera 
      ref="cameraRef"
      :position="[0, 1.6, 5]" 
      :fov="75" 
      :near="0.1" 
      :far="1000" 
    />

    <!-- Mouse look controls (automatically binds click to #lock-button) -->
    <PointerLockControls 
      make-default
      selector="#lock-button"
      @lock="store.setPointerLocked(true)" 
      @unlock="store.setPointerLocked(false)" 
    />

    <!-- The Environment -->
    <LightingSystem />
    <ApartmentModel />

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
