<template>
  <div class="login-wrap">
    <!-- 漂浮光斑 -->
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>

    <el-card class="login-card" shadow="never">
      <div class="brand">
        <div class="logo-ring">
          <el-icon :size="26"><ShoppingCart /></el-icon>
        </div>
        <h2 class="grad-text">校园团购拼单与配送管理平台</h2>
      </div>

      <el-tabs v-model="activeTab" stretch>
        <el-tab-pane label="登录" name="login">
          <el-form :model="loginForm" label-width="70px" @keyup.enter="onLogin">
            <el-form-item label="用户名">
              <el-input v-model="loginForm.username" placeholder="请输入用户名" clearable>
                <template #prefix><el-icon><User /></el-icon></template>
              </el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="loginForm.password" type="password" show-password placeholder="请输入密码">
                <template #prefix><el-icon><Lock /></el-icon></template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="login-btn" :loading="loading" @click="onLogin">
                登 录
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="学生注册" name="register">
          <el-form :model="regForm" label-width="80px">
            <el-form-item label="用户名">
              <el-input v-model="regForm.username" placeholder="3-20 位" clearable />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="regForm.password" type="password" show-password placeholder="6-32 位" />
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="regForm.realName" placeholder="真实姓名" clearable />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="regForm.phone" placeholder="手机号" clearable />
            </el-form-item>
            <el-form-item label="宿舍">
              <div class="dorm">
                <el-input-number v-model="regForm.dormBuilding" :min="1" controls-position="right" placeholder="楼" />
                <el-input-number v-model="regForm.dormFloor" :min="1" controls-position="right" placeholder="层" />
                <el-input-number v-model="regForm.dormRoom" :min="1" controls-position="right" placeholder="室" />
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="success" style="width: 100%" :loading="loading" @click="onRegister">注 册</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import { register } from '@/api'

const router = useRouter()
const store = useUserStore()

const activeTab = ref('login')
const loading = ref(false)

const loginForm = reactive({ username: '', password: '' })
const regForm = reactive({
  username: '',
  password: '',
  realName: '',
  phone: '',
  dormBuilding: undefined,
  dormFloor: undefined,
  dormRoom: undefined
})

function homeForRole(role) {
  if (role === 'ADMIN') return '/admin/dashboard'
  if (role === 'DELIVERY') return '/delivery'
  return '/home'
}

async function onLogin() {
  if (!loginForm.username || !loginForm.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  loading.value = true
  try {
    const data = await store.login(loginForm)
    ElMessage.success('登录成功')
    router.push(homeForRole(data.user.role))
  } finally {
    loading.value = false
  }
}

async function onRegister() {
  if (!regForm.username || !regForm.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  loading.value = true
  try {
    await register(regForm)
    ElMessage.success('注册成功，请登录')
    activeTab.value = 'login'
    loginForm.username = regForm.username
    loginForm.password = ''
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrap {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* 漂浮光斑 */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.35;
  pointer-events: none;
  animation: float 10s ease-in-out infinite;
}
.orb-1 {
  width: 460px;
  height: 460px;
  background: #6366f1;
  top: -140px;
  left: -120px;
}
.orb-2 {
  width: 380px;
  height: 380px;
  background: #8b5cf6;
  bottom: -120px;
  right: -100px;
  animation-delay: -3.5s;
}
.orb-3 {
  width: 280px;
  height: 280px;
  background: #22d3ee;
  top: 42%;
  left: 58%;
  opacity: 0.25;
  animation-delay: -6s;
}
@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(36px, -30px) scale(1.1);
  }
}

.login-card {
  width: 440px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  border: 1px solid rgba(99, 102, 241, 0.2);
  box-shadow: 0 24px 70px rgba(79, 70, 229, 0.18);
  position: relative;
  overflow: hidden;
}
/* 顶部流动光带 */
.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #22d3ee, #6366f1);
  background-size: 300% 100%;
  animation: gradShift 4s linear infinite;
}
@keyframes gradShift {
  to {
    background-position: 300% 0;
  }
}

.brand {
  text-align: center;
  margin-bottom: 14px;
}
.logo-ring {
  width: 58px;
  height: 58px;
  margin: 0 auto 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  box-shadow: 0 0 24px rgba(129, 140, 248, 0.6);
  animation: pulse 2.6s ease-in-out infinite;
}
@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 18px rgba(129, 140, 248, 0.45);
  }
  50% {
    box-shadow: 0 0 34px rgba(139, 92, 246, 0.8);
  }
}
.brand h2 {
  margin: 0 0 6px;
  font-size: 21px;
  font-weight: 800;
}
.brand p {
  margin: 0;
  color: #64748b;
  font-size: 12.5px;
}

.login-btn {
  width: 100%;
  font-size: 15px;
  letter-spacing: 4px;
}

.dorm {
  display: flex;
  gap: 6px;
}
.dorm .el-input-number {
  width: 33%;
}

.tips {
  margin-top: 14px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(99, 102, 241, 0.07);
  border: 1px dashed rgba(99, 102, 241, 0.3);
}
.tip-line {
  color: #64748b;
  font-size: 12px;
  line-height: 1.9;
}
.dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 8px;
  border-radius: 50%;
  background: #22d3ee;
  box-shadow: 0 0 8px #22d3ee;
  vertical-align: middle;
}
</style>
