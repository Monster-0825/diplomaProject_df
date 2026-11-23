<template>
  <el-container class="layout">
    <el-aside width="220px" class="aside">
      <div class="logo">
        <span class="logo-dot"></span>
        <span class="grad-text logo-text">校园团购平台</span>
      </div>
      <el-menu :default-active="$route.path" router class="side-menu">
        <el-menu-item v-for="m in menus" :key="m.path" :index="m.path">
          <el-icon><component :is="m.icon" /></el-icon>
          <span>{{ m.title }}</span>
        </el-menu-item>
      </el-menu>
      <div class="aside-footer">
        <span class="live-dot"></span> MySQL · 服务在线
      </div>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-title grad-text">{{ currentTitle }}</div>
        <div class="header-right">
          <el-tag size="small" effect="dark" type="warning">{{ roleText[store.role] }}</el-tag>
          <el-dropdown @command="onCommand">
            <span class="user">
              <el-avatar :size="28" class="avatar">{{ (store.user?.realName || store.user?.username || '?').slice(0, 1) }}</el-avatar>
              {{ store.user?.realName || store.user?.username }}
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { roleText } from '@/utils/dict'

const route = useRoute()
const router = useRouter()
const store = useUserStore()

const allMenus = [
  { path: '/home', title: '首页', icon: 'HomeFilled', roles: ['STUDENT', 'DELIVERY', 'ADMIN'] },
  { path: '/activities', title: '团购活动', icon: 'ShoppingCart', roles: ['STUDENT', 'ADMIN'] },
  { path: '/my-orders', title: '我的订单', icon: 'List', roles: ['STUDENT'] },
  { path: '/delivery', title: '配送任务', icon: 'Van', roles: ['DELIVERY'] },
  { path: '/admin/dashboard', title: '数据仪表盘', icon: 'DataLine', roles: ['ADMIN'] },
  { path: '/admin/users', title: '用户管理', icon: 'User', roles: ['ADMIN'] },
  { path: '/admin/activities', title: '活动管理', icon: 'Goods', roles: ['ADMIN'] },
  { path: '/admin/orders', title: '订单管理', icon: 'Tickets', roles: ['ADMIN'] },
  { path: '/admin/deliveries', title: '配送管理', icon: 'Van', roles: ['ADMIN'] }
]

const menus = computed(() => allMenus.filter((m) => m.roles.includes(store.role)))
const currentTitle = computed(() => menus.value.find((m) => m.path === route.path)?.title || '')

function onCommand(cmd) {
  if (cmd === 'logout') {
    store.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.layout {
  height: 100%;
}

/* 侧边栏：深色玻璃 */
.aside {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-right: 1px solid rgba(99, 102, 241, 0.14);
  display: flex;
  flex-direction: column;
}
.logo {
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.logo-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #818cf8, #22d3ee);
  box-shadow: 0 0 12px rgba(129, 140, 248, 0.9);
  animation: pulse 2.4s ease-in-out infinite;
}
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.35);
  }
}
.logo-text {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 1px;
}

.side-menu {
  flex: 1;
  background: transparent;
  border-right: none;
  padding: 4px 0;
}
.side-menu :deep(.el-menu-item) {
  margin: 5px 10px;
  height: 46px;
  border-radius: 10px;
  color: #475569;
  position: relative;
  transition: all 0.28s ease;
}
.side-menu :deep(.el-menu-item:hover) {
  color: #4338ca;
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.05));
}
.side-menu :deep(.el-menu-item.is-active) {
  color: #fff;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  box-shadow: 0 4px 18px rgba(99, 102, 241, 0.45);
}
/* 激活项左侧光条 */
.side-menu :deep(.el-menu-item.is-active)::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  border-radius: 2px;
  background: #22d3ee;
  box-shadow: 0 0 10px #22d3ee;
}

.aside-footer {
  padding: 14px;
  color: #94a3b8;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 8px #34d399;
  animation: pulse 2s ease-in-out infinite;
}

/* 顶栏：玻璃 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(99, 102, 241, 0.12);
}
.header-title {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: 1px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 14px;
}
.user {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #334155;
}
.avatar {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  font-weight: 700;
}

.main {
  background: transparent;
  padding: 20px;
}
</style>
