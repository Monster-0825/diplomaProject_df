<template>
  <el-card>
    <div class="page-title grad-text">配送管理</div>
    <div class="toolbar">
      <div class="filters">
        <el-select v-model="filters.status" placeholder="状态" clearable style="width: 140px" @change="load">
          <el-option v-for="(t, k) in deliveryStatusText" :key="k" :label="t" :value="k" />
        </el-select>
        <el-button type="primary" @click="load">查询</el-button>
      </div>
    </div>

    <el-table :data="list" v-loading="loading" border stripe>
      <el-table-column prop="orderNo" label="订单号" width="200" />
      <el-table-column prop="activityTitle" label="活动" min-width="160" show-overflow-tooltip />
      <el-table-column prop="deliveryAddress" label="收货地址" min-width="150" show-overflow-tooltip />
      <el-table-column prop="recipientName" label="收货人" width="90" />
      <el-table-column prop="deliveryUserName" label="配送员" width="100">
        <template #default="{ row }">{{ row.deliveryUserName || '-' }}</template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="deliveryStatusType[row.status]">{{ deliveryStatusText[row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" fixed="right">
        <template #default="{ row }">
          <el-button v-if="row.status === 'PENDING'" size="small" type="primary" @click="openAssign(row)">分配</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pager"
      layout="total, prev, pager, next"
      :total="total"
      :page-size="filters.size"
      :current-page="filters.page"
      @current-change="onPage"
    />

    <el-dialog v-model="assignVisible" title="配送分配" width="440px">
      <el-form label-width="90px">
        <el-form-item label="配送员">
          <el-select v-model="assignDriverId" placeholder="留空则自动分配" clearable style="width: 100%">
            <el-option v-for="d in drivers" :key="d.id" :label="d.realName || d.username" :value="d.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAssign">确定分配</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { adminDeliveries, adminUsers, assignDelivery } from '@/api'
import { deliveryStatusText, deliveryStatusType } from '@/utils/dict'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const filters = reactive({ status: '', page: 1, size: 10 })
const assignVisible = ref(false)
const assignTaskId = ref(null)
const assignDriverId = ref(null)
const drivers = ref([])

async function load() {
  loading.value = true
  try {
    const data = await adminDeliveries(filters)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

async function loadDrivers() {
  const data = await adminUsers({ role: 'DELIVERY', page: 1, size: 100 })
  drivers.value = data.list.filter((d) => d.enabled)
}

function onPage(p) {
  filters.page = p
  load()
}

function openAssign(row) {
  assignTaskId.value = row.id
  assignDriverId.value = null
  assignVisible.value = true
}

async function submitAssign() {
  await assignDelivery(assignTaskId.value, assignDriverId.value)
  ElMessage.success('分配成功')
  assignVisible.value = false
  load()
}

onMounted(() => {
  load()
  loadDrivers()
})
</script>

<style scoped>
.toolbar {
  margin-bottom: 12px;
}
.filters {
  display: flex;
  gap: 8px;
}
.pager {
  margin-top: 12px;
  justify-content: flex-end;
}
</style>
