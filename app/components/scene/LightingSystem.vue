<script setup lang="ts">
import { useRealEstateStore } from '~/stores/realEstateStore'
import { computed } from 'vue'

const store = useRealEstateStore()

const ambientIntensity = computed(() => {
  if (store.timeOfDay === 'morning') return 1.5
  if (store.timeOfDay === 'sunset') return 0.8
  return 0.2 // night
})

const sunColor = computed(() => {
  if (store.timeOfDay === 'morning') return '#ffffff'
  if (store.timeOfDay === 'sunset') return '#ffaa55'
  return '#223355' // moonlight
})

const sunIntensity = computed(() => {
  if (store.timeOfDay === 'morning') return 3
  if (store.timeOfDay === 'sunset') return 2
  return 0.5 // night
})

const sunPosition = computed(() => {
  if (store.timeOfDay === 'morning') return [5, 10, 5]
  if (store.timeOfDay === 'sunset') return [10, 2, -10]
  return [-5, 8, -5] // moon position
})
</script>

<template>
  <TresGroup>
    <TresAmbientLight :intensity="ambientIntensity" />
    <TresDirectionalLight
      cast-shadow
      :position="sunPosition"
      :intensity="sunIntensity"
      :color="sunColor"
      :shadow-mapSize-width="2048"
      :shadow-mapSize-height="2048"
      :shadow-camera-far="50"
      :shadow-camera-left="-10"
      :shadow-camera-right="10"
      :shadow-camera-top="10"
      :shadow-camera-bottom="-10"
    />
    
    <!-- Artificial lights inside the apartment that turn on at night -->
    <TresPointLight
      v-if="store.timeOfDay === 'night'"
      :position="[-2, 2.5, 5]"
      :intensity="2"
      color="#ffddaa"
      cast-shadow
    />
    <TresPointLight
      v-if="store.timeOfDay === 'night'"
      :position="[5, 2.5, -5]"
      :intensity="2"
      color="#ffddaa"
      cast-shadow
    />
  </TresGroup>
</template>
