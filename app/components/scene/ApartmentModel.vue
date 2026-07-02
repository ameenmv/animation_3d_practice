<script setup lang="ts">
import { useRealEstateStore } from '~/stores/realEstateStore'
import Door from './Door.vue'
import { DoubleSide, MeshStandardMaterial, Color } from 'three'
import { computed } from 'vue'

const store = useRealEstateStore()

// We use computed materials so they update reactively when the store changes
const floorMaterial = computed(() => new MeshStandardMaterial({ color: new Color(store.floorColor), roughness: 0.8 }))
const wallMaterial = computed(() => new MeshStandardMaterial({ color: new Color(store.wallColor), roughness: 0.9, side: DoubleSide }))

// Handle clicking on walls or floors
const onWallClick = (event: any) => {
  event.stopPropagation()
  store.openCustomizer('wall')
}

const onFloorClick = (event: any) => {
  event.stopPropagation()
  store.openCustomizer('floor')
}
</script>

<template>
  <TresGroup>
    <!-- Floor -->
    <TresMesh :position="[0, 0, 0]" :rotation="[-Math.PI / 2, 0, 0]" @click="onFloorClick" receive-shadow>
      <TresPlaneGeometry :args="[20, 20]" />
      <primitive :object="floorMaterial" />
    </TresMesh>

    <!-- Ceiling -->
    <TresMesh :position="[0, 3, 0]" :rotation="[Math.PI / 2, 0, 0]" receive-shadow>
      <TresPlaneGeometry :args="[20, 20]" />
      <TresMeshStandardMaterial color="#ffffff" :roughness="1" :side="DoubleSide" />
    </TresMesh>

    <!-- Outer Walls -->
    <!-- North Wall -->
    <TresMesh :position="[0, 1.5, -10]" @click="onWallClick" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[20, 3, 0.2]" />
      <primitive :object="wallMaterial" />
    </TresMesh>
    
    <!-- South Wall -->
    <TresMesh :position="[0, 1.5, 10]" @click="onWallClick" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[20, 3, 0.2]" />
      <primitive :object="wallMaterial" />
    </TresMesh>

    <!-- East Wall -->
    <TresMesh :position="[10, 1.5, 0]" @click="onWallClick" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[0.2, 3, 20]" />
      <primitive :object="wallMaterial" />
    </TresMesh>

    <!-- West Wall -->
    <TresMesh :position="[-10, 1.5, 0]" @click="onWallClick" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[0.2, 3, 20]" />
      <primitive :object="wallMaterial" />
    </TresMesh>

    <!-- Inner Wall dividing living room and bedroom -->
    <TresGroup :position="[0, 0, 0]">
      <!-- Left side of inner wall -->
      <TresMesh :position="[-5, 1.5, 0]" @click="onWallClick" cast-shadow receive-shadow>
        <TresBoxGeometry :args="[10, 3, 0.2]" />
        <primitive :object="wallMaterial" />
      </TresMesh>
      
      <!-- Right side of inner wall -->
      <TresMesh :position="[6.5, 1.5, 0]" @click="onWallClick" cast-shadow receive-shadow>
        <TresBoxGeometry :args="[7, 3, 0.2]" />
        <primitive :object="wallMaterial" />
      </TresMesh>
      
      <!-- Top header above the door -->
      <TresMesh :position="[1.5, 2.5, 0]" @click="onWallClick" cast-shadow receive-shadow>
        <TresBoxGeometry :args="[3, 1, 0.2]" />
        <primitive :object="wallMaterial" />
      </TresMesh>
      
      <!-- The Interactive Door (Width = 3, Height = 2) -->
      <!-- Door hinge is placed at x=0, so door is from 0 to 3 -->
      <Door :position="[0, 0, 0]" />
    </TresGroup>

  </TresGroup>
</template>
