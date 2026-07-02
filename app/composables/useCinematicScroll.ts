import { onMounted, onUnmounted, reactive, shallowRef } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { type PerspectiveCamera, type Group } from 'three'

gsap.registerPlugin(ScrollTrigger)

// Global state for shaders (mouse NDC, etc.)
export const globalUniforms = reactive({
  uMouse: { value: [0, 0] },
  uTime: { value: 0 },
  uScrollProgress: { value: 0 }
})

export function useCinematicScroll() {
  let tickerCb: (() => void) | null = null
  let cameraTl: gsap.core.Timeline | null = null

  // Track mouse coordinates for magnetic effect
  function setupMouseTracking() {
    const onMove = (e: MouseEvent) => {
      // NDC (-1 to 1)
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -(e.clientY / window.innerHeight) * 2 + 1
      
      // Smooth interpolation using gsap.to on the uniform value directly
      gsap.to(globalUniforms.uMouse.value, {
        0: nx, 
        1: ny,
        duration: 0.8,
        ease: 'power2.out'
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }

  // Bind camera animation to scroll (flying through particles)
  function setupCameraChoreography(camera: PerspectiveCamera, sceneGroup: Group) {
    cameraTl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.1, // very fast scrub for immediate uniform response
        onUpdate: (self) => {
          globalUniforms.uScrollProgress.value = self.progress
        }
      }
    })
    
    // We don't move the camera anymore; the MorphingOrb shader handles all 
    // scaling, displacement, and color shifting based on uScrollProgress!
  }

  // Ticker for global time
  function startTicker() {
    tickerCb = () => {
      globalUniforms.uTime.value += 0.005
    }
    gsap.ticker.add(tickerCb)
  }

  return {
    setupMouseTracking,
    setupCameraChoreography,
    startTicker,
    cleanup: () => {
      if (tickerCb) gsap.ticker.remove(tickerCb)
      cameraTl?.kill()
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }
}
