<script setup lang="ts">
import { ref } from 'vue'
import { useRenderLoop } from '@tresjs/core'
import { useRealEstateStore } from '~/stores/realEstateStore'

const props = defineProps<{
  position: [number, number, number]
}>()

const store = useRealEstateStore()
const fanGroup = ref<any>(null)

// Physics loop for the fan
const { onLoop } = useRenderLoop()
let currentSpeed = 0
const maxSpeed = 10.0
const acceleration = 2.0
const friction = 1.0

onLoop(({ delta }) => {
  if (!fanGroup.value) return

  // Smooth acceleration / deceleration
  if (store.isFanOn) {
    currentSpeed = Math.min(currentSpeed + acceleration * delta, maxSpeed)
  } else {
    currentSpeed = Math.max(currentSpeed - friction * delta, 0)
  }

  // Apply rotation
  fanGroup.value.rotation.y += currentSpeed * delta
})
</script>

<template>
  <TresGroup :position="position">
    <!-- Fan Base attached to ceiling -->
    <TresMesh :position="[0, 0, 0]">
      <TresCylinderGeometry :args="[0.1, 0.1, 0.5]" />
      <TresMeshStandardMaterial color="#222" metalness="0.8" roughness="0.2" />
    </TresMesh>

    <!-- The spinning blades group -->
    <TresGroup ref="fanGroup" :position="[0, -0.2, 0]">
      <TresMesh :position="[0, 0, 0]">
        <TresCylinderGeometry :args="[0.2, 0.2, 0.1]" />
        <TresMeshStandardMaterial color="#222" metalness="0.8" roughness="0.2" />
      </TresMesh>

      <!-- Blade 1 -->
      <TresMesh :position="[0.8, 0, 0]" cast-shadow>
        <TresBoxGeometry :args="[1.5, 0.02, 0.2]" />
        <TresMeshStandardMaterial color="#34495e" roughness="0.5" />
      </TresMesh>
      
      <!-- Blade 2 -->
      <TresMesh :position="[-0.8, 0, 0]" cast-shadow>
        <TresBoxGeometry :args="[1.5, 0.02, 0.2]" />
        <TresMeshStandardMaterial color="#34495e" roughness="0.5" />
      </TresMesh>
      
      <!-- Blade 3 -->
      <TresMesh :position="[0, 0, 0.8]" :rotation="[0, Math.PI / 2, 0]" cast-shadow>
        <TresBoxGeometry :args="[1.5, 0.02, 0.2]" />
        <TresMeshStandardMaterial color="#34495e" roughness="0.5" />
      </TresMesh>
      
      <!-- Blade 4 -->
      <TresMesh :position="[0, 0, -0.8]" :rotation="[0, Math.PI / 2, 0]" cast-shadow>
        <TresBoxGeometry :args="[1.5, 0.02, 0.2]" />
        <TresMeshStandardMaterial color="#34495e" roughness="0.5" />
      </TresMesh>
    </TresGroup>
  </TresGroup>
</template>
