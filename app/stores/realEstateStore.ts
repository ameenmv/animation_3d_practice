import { defineStore } from 'pinia'

export const useRealEstateStore = defineStore('realEstate', {
  state: () => ({
    // Environment State
    wallColor: '#e0e0e0',
    floorColor: '#8a7964', // A wood-like tone
    couchColor: '#34495e',
    timeOfDay: 'morning' as 'morning' | 'sunset' | 'night',
    
    // Interactive Elements State
    isTvOn: false,
    isFanOn: true,
    isPS5On: false,
    
    // UI & Interaction State
    isPointerLocked: false,
    customizerTarget: null as 'wall' | 'floor' | 'couch' | null, // What the user is currently editing
    
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
    setCouchColor(color: string) {
      this.couchColor = color
    },
    toggleTv() {
      this.isTvOn = !this.isTvOn
    },
    toggleFan() {
      this.isFanOn = !this.isFanOn
    },
    togglePS5() {
      this.isPS5On = !this.isPS5On
      if (this.isPS5On && !this.isTvOn) {
        this.isTvOn = true // turning on PS5 automatically turns on TV
      }
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
    openCustomizer(target: 'wall' | 'floor' | 'couch') {
      this.customizerTarget = target
      // Usually, opening a UI means unlocking the pointer
      if (this.isPointerLocked && document.pointerLockElement) {
        document.exitPointerLock()
      }
    }
  }
})
