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
        trigger: 'body', // The whole body scrolls
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        onUpdate: (self) => {
          globalUniforms.uScrollProgress.value = self.progress
        }
      }
    })

    // Cinematic camera flight path
    cameraTl.to(camera.position, {
      z: -10, // Fly forward through particles
      y: -2,
      ease: 'power1.inOut'
    }, 0)

    cameraTl.to(camera.rotation, {
      x: 0.2, // Look slightly up as we fly
      ease: 'power1.inOut'
    }, 0)
    
    // Rotate the entire scene slightly on scroll
    cameraTl.to(sceneGroup.rotation, {
      y: Math.PI * 0.25,
      ease: 'none'
    }, 0)
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
