<template>
  <el-card>
    <div class="page-title grad-text">用户管理</div>
    <div class="toolbar">
      <div class="filters">
        <el-input v-model="filters.keyword" placeholder="用户名/姓名" clearable style="width: 180px" @keyup.enter="load" />
        <el-select v-model="filters.role" placeholder="角色" clearable style="width: 120px" @change="load">
          <el-option label="学生" value="STUDENT" />
          <el-option label="配送员" value="DELIVERY" />
          <el-option label="管理员" value="ADMIN" />
        </el-select>
        <el-button type="primary" @click="load">查询</el-button>
      </div>
      <el-button type="success" @click="openCreate">新增用户</el-button>
    </div>

    <el-table :data="list" v-loading="loading" border stripe>
      <el-table-column prop="username" label="用户名" width="140" />
      <el-table-column prop="realName" label="姓名" width="120" />
      <el-table-column prop="phone" label="手机号" width="140" />
      <el-table-column label="角色" width="100">
        <template #default="{ row }">
          <el-tag :type="row.role === 'ADMIN' ? 'danger' : row.role === 'DELIVERY' ? 'warning' : 'primary'">
            {{ roleText[row.role] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.enabled ? 'success' : 'info'">{{ row.enabled ? '启用' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="注册时间" width="170" />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row)">编辑</el-button>
          <el-button v-if="row.enabled" size="small" type="danger" @click="onDisable(row)">禁用</el-button>
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

    <el-dialog v-model="dialogVisible" :title="editing ? '编辑用户' : '新增用户'" width="520px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名" :required="!editing">
          <el-input v-model="form.username" :disabled="editing" />
        </el-form-item>
        <el-form-item :label="editing ? '重置密码' : '密码'" :required="!editing">
          <el-input v-model="form.password" type="password" show-password :placeholder="editing ? '留空则不修改' : ''" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.realName" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role" style="width: 100%">
            <el-option label="学生" value="STUDENT" />
            <el-option label="配送员" value="DELIVERY" />
            <el-option label="管理员" value="ADMIN" />
          </el-select>
        </el-form-item>
        <el-form-item label="宿舍">
          <div class="dorm">
            <el-input-number v-model="form.dormBuilding" :min="1" controls-position="right" placeholder="楼" />
            <el-input-number v-model="form.dormFloor" :min="1" controls-position="right" placeholder="层" />
            <el-input-number v-model="form.dormRoom" :min="1" controls-position="right" placeholder="室" />
          </div>
        </el-form-item>
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
import { adminUsers, createUser, updateUser, disableUser } from '@/api'
import { roleText } from '@/utils/dict'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const filters = reactive({ keyword: '', role: '', page: 1, size: 10 })
const dialogVisible = ref(false)
const editing = ref(null)
const form = reactive({
  username: '',
  password: '',
  realName: '',
  phone: '',
  role: 'STUDENT',
  dormBuilding: undefined,
  dormFloor: undefined,
  dormRoom: undefined
})

async function load() {
  loading.value = true
  try {
    const data = await adminUsers(filters)
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
    username: '',
    password: '',
    realName: '',
    phone: '',
    role: 'STUDENT',
    dormBuilding: undefined,
    dormFloor: undefined,
    dormRoom: undefined
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
    username: row.username,
    password: '',
    realName: row.realName,
    phone: row.phone,
    role: row.role
  })
  dialogVisible.value = true
}

async function submit() {
  if (editing.value) {
    await updateUser(editing.value.id, form)
    ElMessage.success('更新成功')
  } else {
    await createUser(form)
    ElMessage.success('创建成功')
  }
  dialogVisible.value = false
  load()
}

async function onDisable(row) {
  await ElMessageBox.confirm(`确认禁用用户「${row.username}」？`, '提示', { type: 'warning' })
  await disableUser(row.id)
  ElMessage.success('已禁用')
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
.dorm {
  display: flex;
  gap: 6px;
}
.pager {
  margin-top: 12px;
  justify-content: flex-end;
}
</style>
