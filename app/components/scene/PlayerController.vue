<script setup lang="ts">
import { useFirstPersonController } from '~/composables/useFirstPersonController'
import type { Ref } from 'vue'
import type { PerspectiveCamera } from 'three'
import { toRef } from 'vue'

const props = defineProps<{
  camera: PerspectiveCamera | null | undefined
}>()

// Convert the prop to a ref so useFirstPersonController can watch its value
const cameraRef = toRef(props, 'camera')
useFirstPersonController(cameraRef)
</script>

<template>
  <TresGroup />
</template>
