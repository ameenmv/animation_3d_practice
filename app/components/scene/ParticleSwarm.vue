<script setup lang="ts">
import { shallowRef, watch, onUnmounted } from 'vue'
import { BufferGeometry, Float32BufferAttribute, ShaderMaterial, AdditiveBlending, Color } from 'three'
import { globalUniforms } from '~/composables/useCinematicScroll'

const PARTICLE_COUNT = 15000

// Generate random points in a volume
const positions = new Float32Array(PARTICLE_COUNT * 3)
const randoms = new Float32Array(PARTICLE_COUNT)

for (let i = 0; i < PARTICLE_COUNT; i++) {
  // Distribute in a wide cylinder/tunnel
  const radius = 2 + Math.random() * 8
  const theta = Math.random() * Math.PI * 2
  const y = (Math.random() - 0.5) * 20
  
  positions[i * 3 + 0] = Math.cos(theta) * radius
  positions[i * 3 + 1] = y
  positions[i * 3 + 2] = Math.sin(theta) * radius - (Math.random() * 15) // Deep into Z

  randoms[i] = Math.random()
}

const geometry = new BufferGeometry()
geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
geometry.setAttribute('aRandom', new Float32BufferAttribute(randoms, 1))

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScrollProgress;
  
  attribute float aRandom;
  
  varying float vAlpha;
  
  // Basic noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec3 pos = position;
    
    // Slow undulation
    float noise = snoise(vec3(pos.x * 0.2, pos.y * 0.2, uTime * 0.1 + aRandom));
    pos.x += sin(uTime * 0.5 + aRandom * 10.0) * noise * 2.0;
    pos.y += cos(uTime * 0.5 + aRandom * 10.0) * noise * 2.0;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Size attenuation
    gl_PointSize = (12.0 * aRandom + 4.0) * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    
    vAlpha = aRandom * 0.6 + 0.2;
  }
`

const fragmentShader = `
  varying float vAlpha;
  
  void main() {
    // Soft circular particle
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    float intensity = (0.5 - dist) * 2.0;
    
    // Glow color (Electric cyan / purple)
    vec3 color = mix(vec3(0.0, 0.8, 1.0), vec3(0.7, 0.0, 1.0), vAlpha);
    
    gl_FragColor = vec4(color, intensity * vAlpha);
  }
`

const material = shallowRef(
  new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: globalUniforms.uTime,
      uMouse: globalUniforms.uMouse,
      uScrollProgress: globalUniforms.uScrollProgress
    }
  })
)

onUnmounted(() => {
  geometry.dispose()
  material.value.dispose()
})
</script>

<template>
  <!-- Render 15k custom GLSL particles -->
  <TresPoints :geometry="geometry" :material="material" />
</template>
