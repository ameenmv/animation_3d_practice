<script setup lang="ts">
import { shallowRef, watchEffect, onUnmounted, onMounted } from 'vue'
import { MeshPhysicalMaterial, Color, DoubleSide, Group } from 'three'
import { globalUniforms } from '~/composables/useCinematicScroll'
import gsap from 'gsap'

// A highly refractive, dispersive glass material utilizing WebGL2 transmission
const glassMaterial = shallowRef(
  new MeshPhysicalMaterial({
    color: new Color(0xffffff),
    metalness: 0.1,
    roughness: 0.05,
    transmission: 1.0, // Glass-like transparency
    thickness: 2.5, // Volume for refraction
    ior: 1.52, // Index of refraction for glass
    dispersion: 3.0, // Chromatic aberration / dispersion (r177 feature)
    side: DoubleSide,
    transparent: true,
  })
)

const glassGroup = shallowRef<Group | null>(null)
let time = 0

const floatTicker = () => {
  if (glassGroup.value) {
    time += 0.015
    glassGroup.value.position.y = Math.sin(time) * 0.5
    glassGroup.value.rotation.x = Math.sin(time * 0.5) * 0.2
    glassGroup.value.rotation.y = Math.cos(time * 0.3) * 0.2
  }
}

onMounted(() => {
  gsap.ticker.add(floatTicker)
})

onUnmounted(() => {
  gsap.ticker.remove(floatTicker)
  glassMaterial.value.dispose()
})
</script>

<template>
  <TresGroup :position="[0, -20, 0]"> <!-- Positioned down for the showcase section -->
    
    <!-- 3D Text behind the glass to be refracted (Option A) -->
    <TresGroup :position="[0, 0, -2]">
      <Suspense>
        <Text3D
          text="DISPERSION"
          font="https://raw.githubusercontent.com/Tresjs/assets/main/fonts/FiraCodeRegular.json"
          :size="2"
          :height="0.2"
          :curveSegments="12"
          center
        >
          <TresMeshStandardMaterial color="#00d4ff" :emissive="new Color('#00d4ff')" :emissiveIntensity="0.5" />
        </Text3D>
      </Suspense>
    </TresGroup>

    <!-- The Glass Object -->
    <TresGroup ref="glassGroup">
      <TresMesh :material="glassMaterial" :position="[0, 0, 0]">
        <TresTorusKnotGeometry :args="[1.5, 0.4, 128, 64]" />
      </TresMesh>
    </TresGroup>
    
  </TresGroup>
</template>
