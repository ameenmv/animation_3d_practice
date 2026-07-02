<script setup lang="ts">
import { useRealEstateStore } from '~/stores/realEstateStore'

const props = defineProps<{
  position: [number, number, number],
  rotation?: [number, number, number]
}>()

const store = useRealEstateStore()

const toggleTv = (event: any) => {
  event.stopPropagation()
  store.toggleTv()
}
</script>

<template>
  <TresGroup :position="position" :rotation="rotation || [0,0,0]">
    <!-- TV Frame -->
    <TresMesh :position="[0, 0, 0]">
      <TresBoxGeometry :args="[4, 2.5, 0.1]" />
      <TresMeshStandardMaterial color="#111" roughness="0.2" />
    </TresMesh>

    <!-- TV Screen -->
    <TresMesh :position="[0, 0, 0.06]" @click="toggleTv">
      <TresPlaneGeometry :args="[3.8, 2.3]" />
      <TresMeshStandardMaterial 
        :color="store.isTvOn ? (store.isPS5On ? '#ff2a2a' : '#ffffff') : '#050505'" 
        :emissive="store.isTvOn ? (store.isPS5On ? '#ff0055' : '#3498db') : '#000000'"
        :emissiveIntensity="store.isTvOn ? 2 : 0"
        :roughness="0.1" 
        :metalness="0.8" 
      />
    </TresMesh>

    <!-- Screen Glow (Only visible when ON) -->
    <TresPointLight 
      v-if="store.isTvOn"
      :position="[0, 0, 1]"
      :intensity="2"
      :color="store.isPS5On ? '#ff0055' : '#3498db'"
      :distance="10"
    />
  </TresGroup>
</template>
