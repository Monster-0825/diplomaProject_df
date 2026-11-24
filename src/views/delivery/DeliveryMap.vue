<template>
  <div>
    <el-card class="map-card" shadow="never">
      <div class="map-head">
        <div class="map-head-left">
          <el-button circle class="back-btn" @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <div class="page-title grad-text">宿舍分布地图</div>
        </div>
        <span class="map-tip">点击地图可放大查看 · 结合「路径规划」安排配送顺序</span>
      </div>
      <div class="map-body">
        <el-image
          src="/dormitory.jpg"
          :preview-src-list="['/dormitory.jpg']"
          fit="contain"
          class="map-img"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.replace('/delivery')
  }
}
</script>

<style scoped>
.map-card {
  padding: 4px 10px 14px;
}
.map-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.map-head-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.map-head-left .page-title {
  margin-bottom: 0;
}
.back-btn {
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.25);
  color: #4f46e5;
  transition: all 0.25s ease;
}
.back-btn:hover {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
}
.map-tip {
  color: #64748b;
  font-size: 12.5px;
}
.map-body {
  display: flex;
  justify-content: center;
  background: rgba(99, 102, 241, 0.05);
  border: 1px dashed rgba(99, 102, 241, 0.28);
  border-radius: 12px;
  padding: 16px;
}
.map-img {
  max-width: 100%;
  max-height: calc(100vh - 280px);
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(79, 70, 229, 0.16);
  cursor: zoom-in;
}
.map-img :deep(.el-image__inner) {
  border-radius: 10px;
}
</style>
