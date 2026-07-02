import { onMounted, onUnmounted, ref } from 'vue'
import { useRenderLoop } from '@tresjs/core'
import { Vector3, PerspectiveCamera } from 'three'
import { useRealEstateStore } from '~/stores/realEstateStore'

export function useFirstPersonController(camera: PerspectiveCamera) {
  const store = useRealEstateStore()
  
  const moveState = {
    forward: false,
    backward: false,
    left: false,
    right: false
  }

  const speed = 4.0 // walk speed
  const velocity = new Vector3()
  const direction = new Vector3()

  const onKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        moveState.forward = true
        break
      case 'KeyS':
      case 'ArrowDown':
        moveState.backward = true
        break
      case 'KeyA':
      case 'ArrowLeft':
        moveState.left = true
        break
      case 'KeyD':
      case 'ArrowRight':
        moveState.right = true
        break
    }
  }

  const onKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        moveState.forward = false
        break
      case 'KeyS':
      case 'ArrowDown':
        moveState.backward = false
        break
      case 'KeyA':
      case 'ArrowLeft':
        moveState.left = false
        break
      case 'KeyD':
      case 'ArrowRight':
        moveState.right = false
        break
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
  })

  const { onLoop } = useRenderLoop()

  onLoop(({ delta }) => {
    // Only move if pointer is locked (user is in the game)
    if (!store.isPointerLocked) return

    // Calculate movement direction
    direction.z = Number(moveState.forward) - Number(moveState.backward)
    direction.x = Number(moveState.right) - Number(moveState.left)
    direction.normalize() // consistent speed in all directions

    // Move camera relative to its current rotation
    if (moveState.forward || moveState.backward) {
      velocity.z -= direction.z * speed * delta
    }
    if (moveState.left || moveState.right) {
      velocity.x -= direction.x * speed * delta
    }

    // Apply damping (friction)
    velocity.x -= velocity.x * 10.0 * delta
    velocity.z -= velocity.z * 10.0 * delta

    camera.translateX(velocity.x)
    camera.translateZ(velocity.z)
    
    // Lock Y axis to prevent flying
    camera.position.y = 1.6 

    // Update store for debugging or map
    store.playerPosition.x = camera.position.x
    store.playerPosition.z = camera.position.z
  })

  return {}
}
