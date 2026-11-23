<template>
  <!-- 流动渐变背景层 -->
  <div class="app-bg"></div>
  <!-- 流动粒子层 -->
  <ParticlesBg />
  <!-- 页面切换过渡 -->
  <router-view v-slot="{ Component }">
    <transition name="page" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
import ParticlesBg from './components/ParticlesBg.vue'
</script>

<style>
* {
  box-sizing: border-box;
}
html,
body,
#app {
  height: 100%;
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
}
body {
  background: #eef2ff;
  overflow-x: hidden;
}

/* 流动渐变背景：缓慢漂移的多色渐变 */
.app-bg {
  position: fixed;
  inset: 0;
  z-index: -2;
  background: linear-gradient(-45deg, #e0e7ff, #f3e8ff, #d9f3ff, #e8e6ff, #e0e7ff);
  background-size: 400% 400%;
  animation: bgFlow 22s ease infinite;
}
@keyframes bgFlow {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* 页面切换动画 */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(14px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
