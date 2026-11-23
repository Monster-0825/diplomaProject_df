<template>
  <div>
    <el-card>
      <div class="page-title grad-text">配送任务</div>
      <div class="toolbar">
        <el-tabs v-model="tab" @tab-change="load">
          <el-tab-pane label="待接单任务" name="available" />
          <el-tab-pane label="我的任务" name="mine" />
        </el-tabs>
        <el-button type="primary" @click="openRoute">路径规划</el-button>
      </div>

      <el-table :data="list" v-loading="loading" border stripe>
        <el-table-column prop="orderNo" label="订单号" width="200" />
        <el-table-column prop="activityTitle" label="团购活动" min-width="160" show-overflow-tooltip />
        <el-table-column prop="deliveryAddress" label="收货地址" min-width="160" show-overflow-tooltip />
        <el-table-column prop="recipientName" label="收货人" width="100" />
        <el-table-column prop="recipientPhone" label="电话" width="130" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="deliveryStatusType[row.status]">{{ deliveryStatusText[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'PENDING'" type="primary" size="small" @click="onAccept(row)">接单</el-button>
            <el-button v-if="row.status === 'ACCEPTED'" type="warning" size="small" @click="onPickup(row)">取货</el-button>
            <el-button v-if="row.status === 'PICKED_UP'" type="success" size="small" @click="onComplete(row)">送达</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!loading && list.length === 0" description="暂无任务" />
    </el-card>

    <el-dialog v-model="routeVisible" title="配送路径规划（按楼栋→楼层→房间排序）" width="640px">
      <el-timeline v-if="routeList.length">
        <el-timeline-item
          v-for="r in routeList"
          :key="r.taskId"
          :timestamp="r.orderNo"
          placement="top"
          :type="r.status === 'PICKED_UP' ? 'primary' : 'success'"
        >
          <div class="route-item">
            <span class="seq">第 {{ r.sequence }} 站</span>
            <span class="addr">{{ r.deliveryAddress }}</span>
            <span class="who">{{ r.recipientName }} {{ r.recipientPhone }}</span>
          </div>
        </el-timeline-item>
      </el-timeline>
      <el-empty v-else description="当前没有在途任务" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { deliveryAvailable, myDeliveryTasks, acceptTask, pickupTask, completeTask, getRoute } from '@/api'
import { deliveryStatusText, deliveryStatusType } from '@/utils/dict'

const tab = ref('available')
const loading = ref(false)
const list = ref([])
const routeVisible = ref(false)
const routeList = ref([])

async function load() {
  loading.value = true
  try {
    list.value = tab.value === 'available' ? await deliveryAvailable() : await myDeliveryTasks()
  } finally {
    loading.value = false
  }
}

async function onAccept(row) {
  await acceptTask(row.id)
  ElMessage.success('接单成功')
  load()
}

async function onPickup(row) {
  await pickupTask(row.id)
  ElMessage.success('已取货，开始配送')
  load()
}

async function onComplete(row) {
  await completeTask(row.id)
  ElMessage.success('已送达')
  load()
}

async function openRoute() {
  routeList.value = await getRoute()
  routeVisible.value = true
}

load()
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.route-item {
  display: flex;
  gap: 12px;
  align-items: center;
}
.seq {
  color: #409eff;
  font-weight: 600;
}
.addr {
  font-weight: 600;
}
.who {
  color: #909399;
}
</style>
