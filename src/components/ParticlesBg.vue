<template>
  <canvas ref="canvas" class="particles"></canvas>
</template>

<script setup>
// 流动粒子背景：星点缓慢漂移 + 近距离粒子间连线（纯 Canvas，无依赖）
import { onBeforeUnmount, onMounted, ref } from 'vue'

const canvas = ref(null)
const DPR = Math.min(window.devicePixelRatio || 1, 2)
const COLORS = ['99,102,241', '139,92,246', '6,182,212', '168,85,247']

let ctx = null
let raf = 0
let w = 0
let h = 0
let particles = []

function resize() {
  w = window.innerWidth
  h = window.innerHeight
  canvas.value.width = w * DPR
  canvas.value.height = h * DPR
  canvas.value.style.width = w + 'px'
  canvas.value.style.height = h + 'px'
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
}

function init() {
  const count = Math.min(90, Math.max(40, Math.floor((w * h) / 16000)))
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.8 + 0.6,
    c: COLORS[(Math.random() * COLORS.length) | 0]
  }))
}

function tick() {
  ctx.clearRect(0, 0, w, h)

  // 粒子间连线（距离 < 120px 时透明度渐变）
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i]
      const b = particles[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const d2 = dx * dx + dy * dy
      if (d2 < 120 * 120) {
        const alpha = (1 - Math.sqrt(d2) / 120) * 0.28
        ctx.strokeStyle = `rgba(${a.c},${alpha})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }
  }

  // 粒子漂移
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    if (p.x < 0 || p.x > w) p.vx *= -1
    if (p.y < 0 || p.y > h) p.vy *= -1
    ctx.fillStyle = `rgba(${p.c},0.8)`
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fill()
  }

  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  resize()
  init()
  window.addEventListener('resize', resize)
  tick()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
})
</script>

<style scoped>
.particles {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}
</style>
