<script setup lang="ts">
import { useRealEstateStore } from '~/stores/realEstateStore'
import Door from './Door.vue'
import InteractiveFan from './InteractiveFan.vue'
import InteractiveTV from './InteractiveTV.vue'
import TVUnit from './TVUnit.vue'
import PS5Console from './PS5Console.vue'
import { DoubleSide, MeshStandardMaterial, Color } from 'three'
import { computed } from 'vue'

const store = useRealEstateStore()

const floorMaterial = computed(() => new MeshStandardMaterial({ color: new Color(store.floorColor), roughness: 0.8 }))
const wallMaterial = computed(() => new MeshStandardMaterial({ color: new Color(store.wallColor), roughness: 0.9, side: DoubleSide }))
const couchMaterial = computed(() => new MeshStandardMaterial({ color: new Color(store.couchColor), roughness: 1.0 }))

const onWallClick = (event: any) => { event.stopPropagation(); store.openCustomizer('wall') }
const onFloorClick = (event: any) => { event.stopPropagation(); store.openCustomizer('floor') }
const onCouchClick = (event: any) => { event.stopPropagation(); store.openCustomizer('couch') }
</script>

<template>
  <TresGroup>
    <!-- ════════ LIVING ROOM ════════ -->
    <!-- Floor -->
    <TresMesh :position="[0, 0, 0]" :rotation="[-Math.PI / 2, 0, 0]" @click="onFloorClick" receive-shadow>
      <TresPlaneGeometry :args="[20, 20]" />
      <primitive :object="floorMaterial" />
    </TresMesh>

    <!-- Ceiling -->
    <TresMesh :position="[0, 4, 0]" :rotation="[Math.PI / 2, 0, 0]" receive-shadow>
      <TresPlaneGeometry :args="[20, 20]" />
      <TresMeshStandardMaterial color="#ffffff" :roughness="1" :side="DoubleSide" />
    </TresMesh>

    <!-- Solid Walls (North, East, West) -->
    <TresMesh :position="[0, 2, -10]" @click="onWallClick" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[20, 4, 0.4]" />
      <primitive :object="wallMaterial" />
    </TresMesh>
    
    <TresMesh :position="[10, 2, 0]" @click="onWallClick" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[0.4, 4, 20]" />
      <primitive :object="wallMaterial" />
    </TresMesh>

    <TresMesh :position="[-10, 2, 0]" @click="onWallClick" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[0.4, 4, 20]" />
      <primitive :object="wallMaterial" />
    </TresMesh>

    <!-- South Wall (Glass looking out to patio) -->
    <TresMesh :position="[-8, 2, 10]" @click="onWallClick" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[4, 4, 0.4]" />
      <primitive :object="wallMaterial" />
    </TresMesh>
    <TresMesh :position="[8, 2, 10]" @click="onWallClick" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[4, 4, 0.4]" />
      <primitive :object="wallMaterial" />
    </TresMesh>
    
    <!-- Big Glass Window (A bit of transmission for realism) -->
    <TresMesh :position="[0, 2, 10]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[12, 4, 0.1]" />
      <TresMeshPhysicalMaterial 
        color="#aaccff" 
        :transmission="0.9" 
        :opacity="1" 
        :roughness="0.1" 
        :metalness="0.1" 
        :ior="1.5"
        :thickness="0.5" 
      />
    </TresMesh>

    <!-- The Egyptian Rug -->
    <TresMesh :position="[0, 0.01, -2]" :rotation="[-Math.PI / 2, 0, 0]" receive-shadow>
      <TresPlaneGeometry :args="[8, 10]" />
      <!-- A rich red/gold patterned rug (using color for now) -->
      <TresMeshStandardMaterial color="#8b0000" :roughness="0.9" />
    </TresMesh>

    <!-- ════════ LIVING ROOM FURNITURE ════════ -->
    <!-- The Arabic Majlis Couch (Lower to the ground, traditional style) -->
    <TresGroup :position="[0, 0.2, 0]" @click="onCouchClick">
      <!-- Wooden Base -->
      <TresMesh :position="[0, -0.1, 0]" cast-shadow receive-shadow>
        <TresBoxGeometry :args="[7, 0.2, 3.2]" />
        <TresMeshStandardMaterial color="#3d2c1c" roughness="0.9" />
      </TresMesh>
      
      <!-- Seat Cushions -->
      <TresMesh :position="[0, 0.1, 0]" cast-shadow receive-shadow>
        <TresBoxGeometry :args="[6.8, 0.4, 3]" />
        <primitive :object="couchMaterial" />
      </TresMesh>
      
      <!-- Backrest Cushions -->
      <TresMesh :position="[0, 0.8, -1.3]" cast-shadow receive-shadow>
        <TresBoxGeometry :args="[6.8, 1, 0.4]" />
        <primitive :object="couchMaterial" />
      </TresMesh>
      
      <!-- Armrests (Wooden) -->
      <TresMesh :position="[-3.4, 0.5, 0]" cast-shadow receive-shadow>
        <TresBoxGeometry :args="[0.2, 1.2, 3.2]" />
        <TresMeshStandardMaterial color="#3d2c1c" roughness="0.9" />
      </TresMesh>
      <TresMesh :position="[3.4, 0.5, 0]" cast-shadow receive-shadow>
        <TresBoxGeometry :args="[0.2, 1.2, 3.2]" />
        <TresMeshStandardMaterial color="#3d2c1c" roughness="0.9" />
      </TresMesh>
    </TresGroup>

    <!-- The TV Unit -->
    <TVUnit :position="[0, 0, -9.6]" />

    <!-- The PS5 Console resting on the TV Unit -->
    <PS5Console :position="[1.5, 0.6, -9.6]" :rotation="[0, -0.2, 0]" />

    <!-- The Interactive TV on North Wall -->
    <InteractiveTV :position="[0, 2, -9.8]" />

    <!-- The Interactive Ceiling Fan -->
    <InteractiveFan :position="[0, 3.8, 0]" />


    <!-- ════════ OUTDOOR PATIO ════════ -->
    <!-- Patio Floor -->
    <TresMesh :position="[0, 0, 20]" :rotation="[-Math.PI / 2, 0, 0]" receive-shadow>
      <TresPlaneGeometry :args="[20, 20]" />
      <TresMeshStandardMaterial color="#555555" :roughness="0.9" />
    </TresMesh>

    <!-- The Pool -->
    <TresMesh :position="[0, 0.1, 20]" :rotation="[-Math.PI / 2, 0, 0]" cast-shadow receive-shadow>
      <TresPlaneGeometry :args="[10, 10]" />
      <!-- Very basic pool water for now -->
      <TresMeshStandardMaterial color="#00aaff" :roughness="0.1" :metalness="0.8" />
    </TresMesh>
    
  </TresGroup>
</template>
