<script setup lang="ts">
/**
 * index.vue — Cinematic DOM Layer
 * Semantic HTML strictly separated from the WebGL canvas.
 * Handles GSAP scroll-jacking and massive typography animations.
 */
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitText from 'gsap/SplitText' // Note: Requires GSAP Club for real SplitText, but we'll fake it with custom span splitting if needed, or just block stagger.
// We will use a custom simple word/char splitter to avoid paid plugins

gsap.registerPlugin(ScrollTrigger)

useSeoMeta({
  title: 'ANI 3D – Cinematic WebGL Experience',
  description: 'Awwwards-winning level 3D interactive website with semantic HTML and fixed WebGL background.',
})

// Simple custom text splitter for GSAP
function splitTypography(selector: string, type: 'chars' | 'words' = 'chars') {
  const elements = document.querySelectorAll<HTMLElement>(selector)
  const allSpans: HTMLElement[] = []
  
  elements.forEach(el => {
    const text = el.innerText
    el.innerHTML = ''
    el.style.opacity = '1' // Make parent visible now that children are ready to animate
    
    if (type === 'chars') {
      const chars = text.split('')
      chars.forEach(c => {
        const span = document.createElement('span')
        span.innerHTML = c === ' ' ? '&nbsp;' : c
        span.style.display = 'inline-block'
        span.classList.add('split-char')
        el.appendChild(span)
        allSpans.push(span)
      })
    } else {
      const words = text.split(' ')
      words.forEach((w, i) => {
        const span = document.createElement('span')
        span.innerText = w + (i < words.length - 1 ? ' ' : '')
        span.style.display = 'inline-block'
        span.style.overflow = 'hidden'
        
        const inner = document.createElement('span')
        inner.innerText = span.innerText
        inner.style.display = 'inline-block'
        inner.classList.add('split-word-inner')
        
        span.innerText = ''
        span.appendChild(inner)
        el.appendChild(span)
        allSpans.push(inner)
      })
    }
  })
  return allSpans
}

onMounted(() => {
  // ── 1. Hero Reveal ──────────────────────────────────────────
  const heroChars = splitTypography('.hero__title', 'chars')
  gsap.fromTo(heroChars, 
    { y: 100, opacity: 0, rotateX: -90 },
    { 
      y: 0, opacity: 1, rotateX: 0, 
      duration: 1.5, 
      stagger: 0.04, 
      ease: 'power4.out',
      delay: 0.5
    }
  )

  gsap.fromTo('.hero__subtitle', 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out', delay: 1.5 }
  )

  // ── 2. Process Section (Horizontal Scroll-Jacking) ─────────
  const processSection = document.querySelector('.process-wrapper')
  const processCards = gsap.utils.toArray('.process-card')
  
  if (processSection && processCards.length) {
    gsap.to(processCards, {
      xPercent: -100 * (processCards.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: '.process-container',
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => `+=${processSection.scrollWidth}`
      }
    })
  }

  // ── 3. Showcase Reveal ─────────────────────────────────────
  gsap.fromTo('.showcase-overlay',
    { opacity: 0 },
    {
      opacity: 1,
      scrollTrigger: {
        trigger: '#showcase-section',
        start: 'top center',
        end: 'center center',
        scrub: true
      }
    }
  )
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<template>
  <main class="semantic-dom-layer">
    
    <!-- ════════ HERO ════════ -->
    <section id="hero-section" class="screen hero">
      <div class="container hero-content">
        <!-- opacity 0 initially to prevent FOUC before splitTypography runs -->
        <h1 class="hero__title massive-text" style="opacity: 0">
          CINEMATIC<br>WEBGL
        </h1>
        <p class="hero__subtitle">
          An organic fluid particle system powered by pure mathematics and GLSL. Scroll to descend.
        </p>
      </div>
    </section>

    <!-- ════════ PROCESS ════════ -->
    <section id="process-section" class="process-container">
      <div class="process-wrapper">
        <article class="process-card screen">
          <div class="container">
            <h2 class="massive-text">01. DISCOVER</h2>
            <p class="process-desc">We break down the generic web and establish a deeply atmospheric aesthetic.</p>
          </div>
        </article>
        <article class="process-card screen">
          <div class="container">
            <h2 class="massive-text">02. ENGINEER</h2>
            <p class="process-desc">Raw shaders. Explicit memory management. Mathematical motion curves.</p>
          </div>
        </article>
        <article class="process-card screen">
          <div class="container">
            <h2 class="massive-text">03. RENDER</h2>
            <p class="process-desc">60 Frames Per Second. Uncompromising visual fidelity.</p>
          </div>
        </article>
      </div>
    </section>

    <!-- ════════ SHOWCASE (GLASS DISPERSION) ════════ -->
    <section id="showcase-section" class="screen showcase">
      <!-- 
        Option A implemented: 
        The semantic HTML text is visually hidden (sr-only) for accessibility.
        The visible text is rendered via WebGL <Text3D> behind the glass mesh.
      -->
      <div class="sr-only">
        <h2>DISPERSION</h2>
        <p>A true WebGL glass refraction fragment shader distorting the text behind it.</p>
      </div>
      
      <!-- Subtle visual overlay to frame the WebGL glass -->
      <div class="showcase-overlay container">
        <p class="showcase-caption">Raw WebGL2 Transmission & Dispersion</p>
      </div>
    </section>

  </main>
</template>
