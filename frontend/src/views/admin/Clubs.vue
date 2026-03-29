<template>
  <div>
    <div class="page-header">
      <h2>社团管理</h2>
      <el-radio-group v-model="statusFilter" size="small" @change="fetchClubs">
        <el-radio-button value="">全部</el-radio-button>
        <el-radio-button value="pending">待审核</el-radio-button>
        <el-radio-button value="active">已上线</el-radio-button>
        <el-radio-button value="inactive">已下线</el-radio-button>
      </el-radio-group>
    </div>

    <el-card style="border-radius: 12px" v-loading="loading">
      <el-table :data="clubs" stripe>
        <el-table-column label="社团名称" min-width="140">
          <template #default="{ row }">
            <div class="club-name-cell">
              <el-avatar :size="32" :src="row.logo">{{ row.name.charAt(0) }}</el-avatar>
              {{ row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="分类" width="100">
          <template #default="{ row }">{{ row.category?.name ?? '-' }}</template>
        </el-table-column>
        <el-table-column label="成员人数" width="100" prop="memberCount" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small" round>{{ statusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="160">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button-group size="small">
              <el-button type="success" @click="approve(row.id)" :disabled="row.status === 'active'">通过</el-button>
              <el-button type="danger" @click="reject(row.id)" :disabled="row.status === 'inactive'">下线</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { adminApi } from '@/api/admin'

const loading = ref(false)
const clubs = ref<any[]>([])
const statusFilter = ref('')

onMounted(fetchClubs)

async function fetchClubs() {
  loading.value = true
  try {
    clubs.value = await adminApi.getAllClubs(statusFilter.value || undefined)
  } finally {
    loading.value = false
  }
}

async function approve(id: number) {
  await adminApi.approveClub(id)
  ElMessage.success('已通过审核')
  fetchClubs()
}

async function reject(id: number) {
  await adminApi.rejectClub(id)
  ElMessage.success('已下线社团')
  fetchClubs()
}

function statusLabel(s: string) {
  return { pending: '待审核', active: '已上线', inactive: '已下线' }[s] ?? s
}
function statusType(s: string) {
  return { pending: 'warning', active: 'success', inactive: 'info' }[s] ?? 'info'
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-header h2 { margin: 0; font-size: 22px; font-weight: 700; }
.club-name-cell { display: flex; align-items: center; gap: 8px; }
</style>
