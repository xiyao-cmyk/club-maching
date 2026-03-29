<template>
  <div>
    <div class="page-header">
      <h2>用户管理</h2>
      <el-select v-model="roleFilter" clearable placeholder="按角色筛选" size="small" style="width: 140px" @change="fetchUsers">
        <el-option value="student" label="学生" />
        <el-option value="club_admin" label="社团管理员" />
        <el-option value="admin" label="系统管理员" />
      </el-select>
    </div>

    <el-card style="border-radius: 12px" v-loading="loading">
      <el-table :data="users" stripe>
        <el-table-column label="用户名" min-width="120" prop="name" />
        <el-table-column label="邮箱" min-width="180" prop="email" />
        <el-table-column label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="roleType(row.role)" size="small">{{ roleLabel(row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'danger'" size="small">
              {{ row.isActive ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" width="140">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="margin-top: 16px; justify-content: flex-end; display: flex"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="20"
        v-model:current-page="page"
        @current-change="fetchUsers"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api/admin'

const loading = ref(false)
const users = ref<any[]>([])
const total = ref(0)
const page = ref(1)
const roleFilter = ref('')

onMounted(fetchUsers)

async function fetchUsers() {
  loading.value = true
  try {
    const res = await adminApi.getUsers(roleFilter.value || undefined, page.value)
    users.value = res.items
    total.value = res.total
  } finally {
    loading.value = false
  }
}

function roleLabel(r: string) {
  return { student: '学生', club_admin: '社团管理员', admin: '管理员' }[r] ?? r
}
function roleType(r: string) {
  return { student: 'primary', club_admin: 'warning', admin: 'danger' }[r] ?? 'info'
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-header h2 { margin: 0; font-size: 22px; font-weight: 700; }
</style>
