<script setup lang="ts">
const props = defineProps<{
  position: [number, number, number],
  rotation?: [number, number, number]
}>()
</script>

<template>
  <TresGroup :position="position" :rotation="rotation || [0,0,0]">
    <!-- Main Top Board -->
    <TresMesh :position="[0, 0.5, 0]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[6, 0.1, 1.5]" />
      <TresMeshStandardMaterial color="#3d2c1c" roughness="0.8" />
    </TresMesh>
    
    <!-- Left Leg -->
    <TresMesh :position="[-2.9, 0.25, 0]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[0.1, 0.5, 1.5]" />
      <TresMeshStandardMaterial color="#3d2c1c" roughness="0.8" />
    </TresMesh>

    <!-- Right Leg -->
    <TresMesh :position="[2.9, 0.25, 0]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[0.1, 0.5, 1.5]" />
      <TresMeshStandardMaterial color="#3d2c1c" roughness="0.8" />
    </TresMesh>

    <!-- Middle Divider -->
    <TresMesh :position="[0, 0.25, 0]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[0.1, 0.5, 1.3]" />
      <TresMeshStandardMaterial color="#3d2c1c" roughness="0.8" />
    </TresMesh>
    
    <!-- Bottom Shelf -->
    <TresMesh :position="[0, 0.05, 0]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[5.8, 0.1, 1.4]" />
      <TresMeshStandardMaterial color="#3d2c1c" roughness="0.8" />
    </TresMesh>
  </TresGroup>
</template>
