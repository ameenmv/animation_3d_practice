<script setup lang="ts">
import { shallowRef, watch, onMounted } from 'vue'
import { PerspectiveCamera, PCFSoftShadowMap, SRGBColorSpace } from 'three'
import { useTresContext } from '@tresjs/core'
import { PointerLockControls } from '@tresjs/cientos'
import { useRealEstateStore } from '~/stores/realEstateStore'
import { useFirstPersonController } from '~/composables/useFirstPersonController'

import VillaModel from './VillaModel.vue'
import LightingSystem from './LightingSystem.vue'

const store = useRealEstateStore()
const cameraRef = shallowRef<PerspectiveCamera | null>(null)
const controlsRef = shallowRef<any>(null)

// Custom physics & WASD controller must be called synchronously so useRenderLoop works
useFirstPersonController(cameraRef)

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
  // Empty, cameraRef gets populated here automatically
}
</script>

<template>
  <div id="game-canvas-container">
    <!-- Spawn the camera closer to the TV so the couch doesn't block the view of the PS5 -->
    <TresCanvas v-bind="gl" @ready="onReady" class="cinematic-canvas">
      <TresPerspectiveCamera 
      ref="cameraRef"
      :position="[0, 1.6, -4]" 
      :fov="store.cameraFov" 
      :near="0.1" 
      :far="1000" 
    />

    <!-- Mouse look controls -->
    <PointerLockControls 
      make-default
      @lock="store.setPointerLocked(true)" 
      @unlock="store.setPointerLocked(false)" 
    />

    <!-- The Environment -->
    <LightingSystem />
    <VillaModel />

    </TresCanvas>
  </div>
</template>

<style scoped>
#game-canvas-container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
.cinematic-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
