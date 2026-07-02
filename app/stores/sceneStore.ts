/**
 * sceneStore.ts — Pinia store
 * Manages scene-level state (interaction mode, theme, pointer coordinates).
 * 3D objects (Mesh, Camera, etc.) are stored as `shallowRef` to prevent
 * Vue's deep reactivity from traversing Three.js internal object trees,
 * which would cause massive performance regressions.
 */

import { defineStore } from 'pinia'
import { shallowRef, ref } from 'vue'
import type { Mesh, ShaderMaterial } from 'three'

export type InteractionMode = 'idle' | 'hover' | 'drag'

export const useSceneStore = defineStore('scene', () => {
  // ── Three.js refs (shallowRef to prevent deep proxy wrapping) ──
  const orbMesh         = shallowRef<Mesh | null>(null)
  const shaderMaterial  = shallowRef<ShaderMaterial | null>(null)

  // ── App-level reactive state ──
  const interactionMode = ref<InteractionMode>('idle')
  const isLoaded        = ref(false)
  const scrollProgress  = ref(0)          // 0–1 hero scroll progress
  const pointer         = ref({ x: 0, y: 0 })

  // ── Actions ──
  function setMeshReady(mesh: Mesh, mat: ShaderMaterial) {
    orbMesh.value        = mesh
    shaderMaterial.value = mat
    isLoaded.value       = true
  }

  function updatePointer(x: number, y: number) {
    pointer.value.x = x
    pointer.value.y = y
  }

  function setScrollProgress(p: number) {
    scrollProgress.value = Math.min(1, Math.max(0, p))
  }

  return {
    orbMesh,
    shaderMaterial,
    interactionMode,
    isLoaded,
    scrollProgress,
    pointer,
    setMeshReady,
    updatePointer,
    setScrollProgress,
  }
})
