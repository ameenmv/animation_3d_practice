import glsl from 'vite-plugin-glsl'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Enable Nuxt 4 features
  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@tresjs/nuxt',
    '@pinia/nuxt',
  ],

  // Transpile Three.js for proper ESM resolution
  build: {
    transpile: ['three'],
  },

  vite: {
    plugins: [
      // Enables importing .glsl / .vert / .frag files as strings
      glsl(),
    ],
    optimizeDeps: {
      include: [
        'three',
        'gsap',
        'gsap/ScrollTrigger',
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ],
    },
  },

  // Global CSS
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'ANI 3D – Advanced Interactive Experience',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'An advanced, highly optimized 3D interactive website built with Nuxt 4, TresJS, and GSAP.',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;900&display=swap',
        },
      ],
    },
  },
})
