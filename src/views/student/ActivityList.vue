<template>
  <div>
    <el-card>
      <div class="page-title grad-text">团购活动</div>
      <div class="toolbar">
        <el-tabs v-model="tab" @tab-change="load">
          <el-tab-pane label="全部活动" name="all" />
          <el-tab-pane label="我的拼单" name="mine" />
        </el-tabs>
        <div class="filters">
          <el-input v-model="filters.keyword" placeholder="搜索活动标题" clearable style="width: 180px" @keyup.enter="load" />
          <el-select v-model="filters.category" placeholder="分类" clearable style="width: 120px" @change="load">
            <el-option v-for="c in categoryOptions" :key="c" :label="c" :value="c" />
          </el-select>
          <el-select v-model="filters.status" placeholder="状态" clearable style="width: 120px" @change="load">
            <el-option label="拼单中" value="RECRUITING" />
            <el-option label="已成团" value="SUCCESS" />
            <el-option label="已取消" value="CANCELLED" />
            <el-option label="已完成" value="COMPLETED" />
          </el-select>
          <el-button type="primary" @click="load">查询</el-button>
          <el-button v-if="store.role === 'STUDENT'" type="success" @click="openPublish">发起团购</el-button>
        </div>
      </div>

      <el-table :data="list" v-loading="loading" border stripe>
        <el-table-column label="活动" min-width="220">
          <template #default="{ row }">
            <div class="act-title">{{ row.title }}</div>
            <div class="act-meta">
              <el-tag size="small" type="info">{{ row.category }}</el-tag>
              <span class="creator">发起人：{{ row.creatorName || '-' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="140">
          <template #default="{ row }">
            <div class="price">¥{{ row.groupPrice }}</div>
            <div class="origin">原价 ¥{{ row.originPrice }}</div>
          </template>
        </el-table-column>
        <el-table-column label="成团进度" width="160">
          <template #default="{ row }">
            <el-progress :percentage="progress(row)" :color="['#6366f1', '#22d3ee']" :format="() => `${row.currentMembers}/${row.minMembers}`" />
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="activityStatusType[row.status]">{{ activityStatusText[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button v-if="canJoin(row)" type="primary" size="small" @click="onJoin(row)">参团</el-button>
            <el-tag v-else-if="row.joined" type="success" size="small">已参团</el-tag>
            <el-button v-if="row.joined && row.status === 'RECRUITING'" size="small" @click="onCancelJoin(row)">退出</el-button>
            <span v-if="!canJoin(row) && !row.joined" class="muted">{{ row.status === 'RECRUITING' ? '人数已满' : '不可参团' }}</span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="tab === 'all'"
        class="pager"
        layout="total, prev, pager, next"
        :total="total"
        :page-size="filters.size"
        :current-page="filters.page"
        @current-change="onPage"
      />
    </el-card>

    <el-dialog v-model="publishVisible" title="发起团购" width="560px">
      <el-form :model="form" label-width="90px">
        <el-form-item label="活动标题" required>
          <el-input v-model="form.title" placeholder="例如：零食团购 · 坚果混合装" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.category" style="width: 100%">
            <el-option v-for="c in categoryOptions" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="原价" required>
          <el-input-number v-model="form.originPrice" :min="0.01" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="团购价" required>
          <el-input-number v-model="form.groupPrice" :min="0.01" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="成团人数" required>
          <el-input-number v-model="form.minMembers" :min="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="人数上限" required>
          <el-input-number v-model="form.maxMembers" :min="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="活动描述">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="publishVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPublish">发布</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import { listActivities, myJoins, createActivity, joinActivity, cancelJoin } from '@/api'
import { activityStatusText, activityStatusType, categoryOptions } from '@/utils/dict'

const store = useUserStore()
const tab = ref('all')
const loading = ref(false)
const list = ref([])
const total = ref(0)
const filters = reactive({ keyword: '', category: '', status: '', page: 1, size: 10 })
const publishVisible = ref(false)
const form = reactive({
  title: '',
  category: '零食',
  originPrice: undefined,
  groupPrice: undefined,
  minMembers: 6,
  maxMembers: 20,
  description: ''
})

function progress(row) {
  if (!row.minMembers) return 0
  return Math.min(100, Math.round((row.currentMembers / row.minMembers) * 100))
}

function canJoin(row) {
  return (
    (row.status === 'RECRUITING' || row.status === 'SUCCESS') &&
    !row.joined &&
    row.currentMembers < row.maxMembers
  )
}

async function load() {
  loading.value = true
  try {
    if (tab.value === 'all') {
      const data = await listActivities(filters)
      list.value = data.list
      total.value = data.total
    } else {
      list.value = await myJoins()
      total.value = list.value.length
    }
  } finally {
    loading.value = false
  }
}

function onPage(p) {
  filters.page = p
  load()
}

async function onJoin(row) {
  await joinActivity(row.id)
  ElMessage.success('参团成功')
  load()
}

async function onCancelJoin(row) {
  await cancelJoin(row.id)
  ElMessage.success('已退出拼单')
  load()
}

function openPublish() {
  form.title = ''
  form.originPrice = undefined
  form.groupPrice = undefined
  form.minMembers = 6
  form.maxMembers = 20
  form.description = ''
  publishVisible.value = true
}

async function submitPublish() {
  if (!form.title || !form.originPrice || !form.groupPrice) {
    ElMessage.warning('请填写完整信息')
    return
  }
  await createActivity(form)
  ElMessage.success('团购发布成功')
  publishVisible.value = false
  load()
}

load()
</script>

<style scoped>
.toolbar .filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 8px 0;
}
.act-title {
  font-weight: 600;
}
.act-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}
.creator {
  color: #909399;
  font-size: 12px;
}
.price {
  font-weight: 800;
  background: linear-gradient(90deg, #f472b6, #fbbf24);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.origin {
  color: #909399;
  text-decoration: line-through;
  font-size: 12px;
}
.muted {
  color: #c0c4cc;
  font-size: 12px;
}
.pager {
  margin-top: 12px;
  justify-content: flex-end;
}
</style>
