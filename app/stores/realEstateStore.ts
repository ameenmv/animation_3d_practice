import { defineStore } from 'pinia'

export const useRealEstateStore = defineStore('realEstate', {
  state: () => ({
    // Environment State
    wallColor: '#e0e0e0',
    floorColor: '#8a7964', // A wood-like tone
    timeOfDay: 'morning' as 'morning' | 'sunset' | 'night',
    
    // UI & Interaction State
    isPointerLocked: false,
    customizerTarget: null as 'wall' | 'floor' | null, // What the user is currently editing
    
    // Camera / Player Position (for debug or map)
    playerPosition: { x: 0, y: 1.6, z: 0 },
  }),
  actions: {
    setWallColor(color: string) {
      this.wallColor = color
    },
    setFloorColor(color: string) {
      this.floorColor = color
    },
    setTimeOfDay(time: 'morning' | 'sunset' | 'night') {
      this.timeOfDay = time
    },
    setPointerLocked(isLocked: boolean) {
      this.isPointerLocked = isLocked
      // Hide customizer menu when returning to walk mode
      if (isLocked) {
        this.customizerTarget = null
      }
    },
    openCustomizer(target: 'wall' | 'floor') {
      this.customizerTarget = target
      // Usually, opening a UI means unlocking the pointer
      if (this.isPointerLocked && document.pointerLockElement) {
        document.exitPointerLock()
      }
    }
  }
})
