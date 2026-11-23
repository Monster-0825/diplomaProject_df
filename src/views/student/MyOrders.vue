<template>
  <el-card>
    <div class="toolbar">
      <span class="title grad-text">我的订单</span>
      <el-button @click="load">刷新</el-button>
    </div>

    <el-table :data="list" v-loading="loading" border stripe>
      <el-table-column prop="orderNo" label="订单号" width="200" />
      <el-table-column prop="activityTitle" label="团购活动" min-width="180" show-overflow-tooltip />
      <el-table-column label="金额" width="100">
        <template #default="{ row }">
          <span class="price">¥{{ row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" width="110">
        <template #default="{ row }">
          <el-tag :type="orderStatusType[row.status]">{{ orderStatusText[row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="配送状态" width="110">
        <template #default="{ row }">
          <el-tag v-if="row.deliveryStatus" :type="deliveryStatusType[row.deliveryStatus]" size="small">
            {{ deliveryStatusText[row.deliveryStatus] }}
          </el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="收货地址" min-width="150" show-overflow-tooltip>
        <template #default="{ row }">{{ row.deliveryAddress || '-' }}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="下单时间" width="170" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button v-if="row.status === 'WAIT_PAY'" type="primary" size="small" @click="onPay(row)">支付</el-button>
          <el-button v-if="row.status === 'DELIVERED'" type="success" size="small" @click="onConfirm(row)">确认收货</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { myOrders, payOrder, confirmOrder } from '@/api'
import { orderStatusText, orderStatusType, deliveryStatusText, deliveryStatusType } from '@/utils/dict'

const loading = ref(false)
const list = ref([])

async function load() {
  loading.value = true
  try {
    list.value = await myOrders()
  } finally {
    loading.value = false
  }
}

async function onPay(row) {
  await payOrder(row.id)
  ElMessage.success('支付成功，已生成配送任务')
  load()
}

async function onConfirm(row) {
  await confirmOrder(row.id)
  ElMessage.success('已确认收货')
  load()
}

load()
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.title {
  font-weight: 600;
  font-size: 16px;
}
.price {
  color: #f56c6c;
  font-weight: 600;
}
</style>
