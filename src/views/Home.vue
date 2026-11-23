<template>
  <div>
    <el-card class="welcome" shadow="never">
      <div class="welcome-inner">
        <div class="hello">
          <h2>你好，<span class="grad-text">{{ store.user?.realName || store.user?.username }}</span></h2>
          <p class="role-line">
            当前角色：
            <el-tag type="warning" effect="dark">{{ roleText[store.role] }}</el-tag>
          </p>
        </div>
        <div class="flow-badge">
          <div class="flow-ring">
            <el-icon :size="40"><Van /></el-icon>
          </div>
          <span>智慧配送</span>
        </div>
      </div>
    </el-card>

    <div class="quick">
      <el-row :gutter="16">
        <el-col v-for="m in quickMenus" :key="m.path" :span="6">
          <div class="quick-card" @click="$router.push(m.path)">
            <el-icon :size="30" class="quick-icon"><component :is="m.icon" /></el-icon>
            <span class="quick-title">{{ m.title }}</span>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-row v-if="store.role === 'ADMIN'" :gutter="16" class="stats">
      <el-col v-for="s in statCards" :key="s.label" :span="6">
        <el-card class="stat-card" shadow="never">
          <div class="stat-num grad-text">{{ s.value }}</div>
          <div class="stat-label">{{ s.label }}</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useUserStore } from '@/store/user'
import { roleText } from '@/utils/dict'
import { adminStats } from '@/api'

const store = useUserStore()
const stats = ref(null)
const display = reactive({ userCount: 0, activityCount: 0, orderCount: 0, deliveryTaskCount: 0 })

const quickMenus = computed(() => {
  if (store.role === 'STUDENT') {
    return [
      { path: '/activities', title: '浏览团购活动', icon: 'ShoppingCart' },
      { path: '/my-orders', title: '我的订单', icon: 'List' }
    ]
  }
  if (store.role === 'DELIVERY') {
    return [{ path: '/delivery', title: '查看配送任务', icon: 'Van' }]
  }
  return [
    { path: '/admin/dashboard', title: '数据仪表盘', icon: 'DataLine' },
    { path: '/admin/users', title: '用户管理', icon: 'User' },
    { path: '/admin/activities', title: '活动管理', icon: 'Goods' },
    { path: '/admin/orders', title: '订单管理', icon: 'Tickets' }
  ]
})

const statCards = computed(() => {
  if (!stats.value) return []
  return [
    { label: '用户总数', value: display.userCount },
    { label: '团购活动', value: display.activityCount },
    { label: '订单总数', value: display.orderCount },
    { label: '配送任务', value: display.deliveryTaskCount }
  ]
})

// 数字滚动动画
function animateNumbers(targets) {
  const start = performance.now()
  const dur = 1100
  function step(now) {
    const t = Math.min(1, (now - start) / dur)
    const ease = 1 - Math.pow(1 - t, 3)
    display.userCount = Math.round(targets.userCount * ease)
    display.activityCount = Math.round(targets.activityCount * ease)
    display.orderCount = Math.round(targets.orderCount * ease)
    display.deliveryTaskCount = Math.round(targets.deliveryTaskCount * ease)
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

onMounted(async () => {
  if (store.role === 'ADMIN') {
    const s = await adminStats()
    stats.value = s
    animateNumbers(s)
  }
})
</script>

<style scoped>
.welcome {
  margin-bottom: 18px;
  overflow: hidden;
  position: relative;
}
/* 左侧渐变光条 */
.welcome::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #818cf8, #8b5cf6, #22d3ee);
  background-size: 100% 300%;
  animation: slideLight 5s linear infinite;
}
@keyframes slideLight {
  to {
    background-position: 0 300%;
  }
}
.welcome-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.hello h2 {
  margin: 0 0 8px;
  font-size: 24px;
}
.role-line {
  margin: 0 0 8px;
}
.desc {
  margin: 0;
  color: #64748b;
  line-height: 1.7;
  max-width: 640px;
}

.flow-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 13px;
  padding: 0 20px;
}
.flow-ring {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: conic-gradient(from 0deg, #6366f1, #8b5cf6, #22d3ee, #6366f1);
  box-shadow: 0 0 26px rgba(99, 102, 241, 0.55);
  animation: spin 6s linear infinite;
}
.flow-ring .el-icon {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 50%;
  padding: 18px;
}
@keyframes spin {
  to {
    filter: hue-rotate(360deg);
  }
}

.quick {
  margin-bottom: 18px;
}
.quick-card {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(99, 102, 241, 0.16);
  border-radius: 14px;
  padding: 22px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.quick-card:hover {
  transform: translateY(-6px);
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 14px 36px rgba(79, 70, 229, 0.18);
}
.quick-icon {
  color: #6366f1;
  transition: all 0.3s ease;
}
.quick-card:hover .quick-icon {
  color: #0891b2;
  filter: drop-shadow(0 0 10px rgba(8, 145, 178, 0.5));
  transform: scale(1.12);
}
.quick-title {
  color: #334155;
  font-size: 14px;
}

.stats .stat-card {
  text-align: center;
  padding: 8px 0;
}
.stat-num {
  font-size: 32px;
  font-weight: 800;
}
.stat-label {
  color: #64748b;
  margin-top: 6px;
}
</style>
