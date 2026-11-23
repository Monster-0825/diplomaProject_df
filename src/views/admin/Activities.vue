<template>
  <el-card>
    <div class="page-title grad-text">活动管理</div>
    <div class="toolbar">
      <div class="filters">
        <el-input v-model="filters.keyword" placeholder="搜索标题" clearable style="width: 180px" @keyup.enter="load" />
        <el-select v-model="filters.status" placeholder="状态" clearable style="width: 120px" @change="load">
          <el-option label="拼单中" value="RECRUITING" />
          <el-option label="已成团" value="SUCCESS" />
          <el-option label="已取消" value="CANCELLED" />
          <el-option label="已完成" value="COMPLETED" />
        </el-select>
        <el-button type="primary" @click="load">查询</el-button>
      </div>
      <el-button type="success" @click="openCreate">新增活动</el-button>
    </div>

    <el-table :data="list" v-loading="loading" border stripe>
      <el-table-column prop="title" label="活动" min-width="200" show-overflow-tooltip />
      <el-table-column prop="category" label="分类" width="100" />
      <el-table-column label="团购价" width="100">
        <template #default="{ row }"><span class="price">¥{{ row.groupPrice }}</span></template>
      </el-table-column>
      <el-table-column label="进度" width="140">
        <template #default="{ row }">{{ row.currentMembers }}/{{ row.maxMembers }}</template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="activityStatusType[row.status]">{{ activityStatusText[row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="creatorName" label="发起人" width="110" />
      <el-table-column label="操作" width="170" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row)">编辑</el-button>
          <el-button v-if="row.status === 'RECRUITING'" size="small" type="danger" @click="onCancel(row)">取消</el-button>
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

    <el-dialog v-model="dialogVisible" :title="editing ? '编辑活动' : '新增活动'" width="560px">
      <el-form :model="form" label-width="90px">
        <el-form-item label="标题" required><el-input v-model="form.title" /></el-form-item>
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
        <el-form-item label="描述"><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminActivities, createActivity, updateActivity, cancelActivity } from '@/api'
import { activityStatusText, activityStatusType, categoryOptions } from '@/utils/dict'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const filters = reactive({ keyword: '', status: '', page: 1, size: 10 })
const dialogVisible = ref(false)
const editing = ref(null)
const form = reactive({
  title: '',
  category: '零食',
  originPrice: undefined,
  groupPrice: undefined,
  minMembers: 6,
  maxMembers: 20,
  description: ''
})

async function load() {
  loading.value = true
  try {
    const data = await adminActivities(filters)
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

function resetForm() {
  Object.assign(form, {
    title: '',
    category: '零食',
    originPrice: undefined,
    groupPrice: undefined,
    minMembers: 6,
    maxMembers: 20,
    description: ''
  })
}

function openCreate() {
  editing.value = null
  resetForm()
  dialogVisible.value = true
}

function openEdit(row) {
  editing.value = row
  Object.assign(form, {
    title: row.title,
    category: row.category,
    originPrice: row.originPrice,
    groupPrice: row.groupPrice,
    minMembers: row.minMembers,
    maxMembers: row.maxMembers,
    description: row.description
  })
  dialogVisible.value = true
}

async function submit() {
  if (editing.value) {
    await updateActivity(editing.value.id, form)
    ElMessage.success('更新成功')
  } else {
    await createActivity(form)
    ElMessage.success('创建成功')
  }
  dialogVisible.value = false
  load()
}

async function onCancel(row) {
  await ElMessageBox.confirm(`确认取消活动「${row.title}」？`, '提示', { type: 'warning' })
  await cancelActivity(row.id)
  ElMessage.success('已取消')
  load()
}

load()
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
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
