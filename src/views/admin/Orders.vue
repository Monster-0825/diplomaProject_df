<template>
  <el-card>
    <div class="page-title grad-text">订单管理</div>
    <div class="toolbar">
      <div class="filters">
        <el-input v-model="filters.keyword" placeholder="订单号" clearable style="width: 200px" @keyup.enter="load" />
        <el-select v-model="filters.status" placeholder="状态" clearable style="width: 130px" @change="load">
          <el-option v-for="(t, k) in orderStatusText" :key="k" :label="t" :value="k" />
        </el-select>
        <el-button type="primary" @click="load">查询</el-button>
      </div>
    </div>

    <el-table :data="list" v-loading="loading" border stripe>
      <el-table-column prop="orderNo" label="订单号" width="200" />
      <el-table-column prop="activityTitle" label="活动" min-width="180" show-overflow-tooltip />
      <el-table-column label="金额" width="100">
        <template #default="{ row }"><span class="price">¥{{ row.amount }}</span></template>
      </el-table-column>
      <el-table-column label="订单状态" width="120">
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
      <el-table-column prop="createTime" label="下单时间" width="170" />
      <el-table-column prop="completeTime" label="完成时间" width="170" />
    </el-table>

    <el-pagination
      class="pager"
      layout="total, prev, pager, next"
      :total="total"
      :page-size="filters.size"
      :current-page="filters.page"
      @current-change="onPage"
    />
  </el-card>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { adminOrders } from '@/api'
import { orderStatusText, orderStatusType, deliveryStatusText, deliveryStatusType } from '@/utils/dict'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const filters = reactive({ keyword: '', status: '', page: 1, size: 10 })

async function load() {
  loading.value = true
  try {
    const data = await adminOrders(filters)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

function onPage(p) {
  filters.page = p
  load()
}

load()
</script>

<style scoped>
.toolbar {
  margin-bottom: 12px;
}
.filters {
  display: flex;
  gap: 8px;
}
.price {
  color: #f56c6c;
  font-weight: 600;
}
.pager {
  margin-top: 12px;
  justify-content: flex-end;
}
</style>
