<script setup lang="ts">
import { useRealEstateStore } from '~/stores/realEstateStore'

const props = defineProps<{
  position: [number, number, number],
  rotation?: [number, number, number]
}>()

const store = useRealEstateStore()

const togglePS5 = (event: any) => {
  event.stopPropagation()
  store.togglePS5()
}
</script>

<template>
  <TresGroup :position="position" :rotation="rotation || [0,0,0]" @click="togglePS5">
    <!-- Center Black Core -->
    <TresMesh :position="[0, 0, 0]" cast-shadow>
      <TresBoxGeometry :args="[0.3, 1.2, 0.8]" />
      <TresMeshStandardMaterial color="#050505" roughness="0.2" metalness="0.5" />
    </TresMesh>

    <!-- Left White Plate -->
    <TresMesh :position="[-0.17, 0, 0]" cast-shadow>
      <!-- Slightly curved by making it thinner on top, but we'll use a basic box for now -->
      <TresBoxGeometry :args="[0.05, 1.25, 0.85]" />
      <TresMeshStandardMaterial color="#ffffff" roughness="0.1" />
    </TresMesh>

    <!-- Right White Plate -->
    <TresMesh :position="[0.17, 0, 0]" cast-shadow>
      <TresBoxGeometry :args="[0.05, 1.25, 0.85]" />
      <TresMeshStandardMaterial color="#ffffff" roughness="0.1" />
    </TresMesh>

    <!-- Blue LED Glow (When ON) -->
    <TresPointLight 
      v-if="store.isPS5On"
      :position="[0, 0.5, 0.4]"
      :intensity="0.5"
      color="#0044ff"
      :distance="2"
    />
  </TresGroup>
</template>
