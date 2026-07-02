<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'

const props = defineProps<{
  position: [number, number, number]
}>()

const doorGroup = ref(null)
const isOpen = ref(false)

const toggleDoor = (event: any) => {
  event.stopPropagation()
  if (!doorGroup.value) return

  isOpen.value = !isOpen.value
  
  gsap.to(doorGroup.value.rotation, {
    y: isOpen.value ? Math.PI / 2 : 0,
    duration: 1.2,
    ease: 'power2.inOut'
  })
}
</script>

<template>
  <!-- 
    The door hinge is at [0,0,0] (local coordinates).
    The visual door mesh is offset by half its width [1.5, 1, 0] so it pivots from the edge.
  -->
  <TresGroup ref="doorGroup" :position="position">
    <TresMesh :position="[1.5, 1, 0]" @click="toggleDoor" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[3, 2, 0.1]" />
      <TresMeshStandardMaterial color="#3d2c1c" roughness="0.5" />
    </TresMesh>
    
    <!-- Doorknob -->
    <TresMesh :position="[2.7, 1, 0.1]" @click="toggleDoor" cast-shadow>
      <TresSphereGeometry :args="[0.08, 16, 16]" />
      <TresMeshStandardMaterial color="#c0c0c0" metalness="0.8" roughness="0.2" />
    </TresMesh>
    <TresMesh :position="[2.7, 1, -0.1]" @click="toggleDoor" cast-shadow>
      <TresSphereGeometry :args="[0.08, 16, 16]" />
      <TresMeshStandardMaterial color="#c0c0c0" metalness="0.8" roughness="0.2" />
    </TresMesh>
  </TresGroup>
</template>
