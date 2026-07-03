<script setup lang="ts">
import { useRealEstateStore } from '~/stores/realEstateStore'
import { onMounted, onUnmounted } from 'vue'

const store = useRealEstateStore()

useSeoMeta({
  title: 'ANI 3D – Interactive Real Estate',
  description: 'First-person interactive 3D property walkthrough.',
})

// predefined color palettes
const wallColors = ['#ffffff', '#e0e0e0', '#a8b5b2', '#2c3e50', '#d4c4b7']
const floorColors = ['#8a7964', '#5c4d3c', '#d9d9d9', '#222222', '#c6bcae']
const couchColors = ['#34495e', '#8e44ad', '#c0392b', '#16a085', '#f39c12']

const lockPointer = () => {
  try {
    const canvas = document.querySelector('#game-canvas-container canvas')
    if (canvas) {
      canvas.requestPointerLock()
    } else {
      alert('Error: Canvas not found by selector #game-canvas-container canvas')
    }
  } catch (err: any) {
    alert('Error requesting pointer lock: ' + err.message)
  }
}

const handlePointerLockChange = () => {
  store.setPointerLocked(!!document.pointerLockElement)
}

const handlePointerLockError = (event: Event) => {
  alert('Browser rejected Pointer Lock! This usually means the click was not considered a direct user gesture, or there is a browser security restriction.')
}

onMounted(() => {
  document.addEventListener('pointerlockchange', handlePointerLockChange)
  document.addEventListener('pointerlockerror', handlePointerLockError)
})

onUnmounted(() => {
  document.removeEventListener('pointerlockchange', handlePointerLockChange)
  document.removeEventListener('pointerlockerror', handlePointerLockError)
})
</script>

<template>
  <main class="semantic-dom-layer">
    
    <!-- Crosshair -->
    <div v-show="store.isPointerLocked" class="crosshair"></div>

    <!-- Debug Info Overlay -->
    <div v-show="store.isPointerLocked" class="debug-overlay">
      <p>POS: {{ store.playerPosition.x.toFixed(2) }}, {{ store.playerPosition.z.toFixed(2) }}</p>
      <p>FOV: {{ store.cameraFov.toFixed(1) }}</p>
    </div>

    <!-- Start / Pause Menu -->
    <div v-show="!store.isPointerLocked" class="overlay-menu flex-center">
      <div class="glass-panel text-center">
        <h1 class="massive-text" style="font-size: 3rem; margin-bottom: 1rem;">VIRTUAL TOUR</h1>
        <p class="subtitle" style="margin-bottom: 2rem;">
          WASD to move. Mouse to look.<br>
          Scroll Wheel to Zoom in/out.<br>
          Click the PS5 or TV to interact.
        </p>
        <button class="primary-btn" @click="lockPointer">ENTER APARTMENT</button>
      </div>
    </div>

  </main>
</template>

<style scoped>
.semantic-dom-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none; /* Let clicks pass through unless on specific UI elements */
  z-index: 10;
}

.crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.crosshair::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.debug-overlay {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.5);
  color: #0f0;
  padding: 1rem;
  border-radius: 8px;
  font-family: monospace;
  font-size: 1.2rem;
  pointer-events: none;
}

.overlay-menu, .customizer-panel, .global-controls {
  pointer-events: auto;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(5px);
}

.glass-panel {
  background: rgba(255, 255, 255, 0.1);
  padding: 3rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.primary-btn {
  background: white;
  color: black;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}
.primary-btn:hover {
  transform: scale(1.05);
}

.customizer-panel {
  position: absolute;
  top: 50%;
  right: 2rem;
  transform: translateY(-50%);
  background: rgba(20, 20, 20, 0.9);
  padding: 2rem;
  border-radius: 12px;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.color-picker {
  display: flex;
  gap: 10px;
  margin-top: 1rem;
}

.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid rgba(255,255,255,0.2);
  transition: transform 0.2s;
}
.color-swatch:hover {
  transform: scale(1.2);
  border-color: white;
}

.global-controls {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.6);
  padding: 0.5rem;
  border-radius: 30px;
  display: flex;
  gap: 0.5rem;
}

.tod-toggle button {
  background: transparent;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
}
.tod-toggle button.active {
  background: white;
  color: black;
}

.secondary-btn {
  background: transparent;
  color: white;
  border: 1px solid white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}
</style>
