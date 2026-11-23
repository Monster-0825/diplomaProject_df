<template>
  <div>
    <el-row :gutter="16">
      <el-col v-for="c in cards" :key="c.label" :span="6">
        <el-card class="stat-card">
          <div class="num grad-text">{{ c.value }}</div>
          <div class="label">{{ c.label }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="breakdown" header="团购状态分布">
      <el-descriptions :column="4" border>
        <el-descriptions-item label="拼单中">{{ stats.recruitingCount }}</el-descriptions-item>
        <el-descriptions-item label="已成团">{{ stats.successCount }}</el-descriptions-item>
        <el-descriptions-item label="已完成订单">{{ stats.completedOrderCount }}</el-descriptions-item>
        <el-descriptions-item label="待接单配送任务">{{ stats.pendingDeliveryCount }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { adminStats } from '@/api'

const stats = ref({
  userCount: 0,
  studentCount: 0,
  deliveryCount: 0,
  activityCount: 0,
  recruitingCount: 0,
  successCount: 0,
  orderCount: 0,
  deliveryTaskCount: 0,
  completedOrderCount: 0,
  pendingDeliveryCount: 0
})

const cards = computed(() => [
  { label: '用户总数', value: stats.value.userCount },
  { label: '其中学生 / 配送员', value: `${stats.value.studentCount} / ${stats.value.deliveryCount}` },
  { label: '团购活动', value: stats.value.activityCount },
  { label: '订单 / 配送任务', value: `${stats.value.orderCount} / ${stats.value.deliveryTaskCount}` }
])

onMounted(async () => {
  stats.value = await adminStats()
})
</script>

<style scoped>
.stat-card {
  text-align: center;
}
.num {
  font-size: 30px;
  font-weight: 700;
  color: #409eff;
}
.label {
  color: #909399;
  margin-top: 6px;
}
.breakdown {
  margin-top: 16px;
}
</style>
