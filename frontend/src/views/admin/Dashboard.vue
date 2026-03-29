<template>
  <div>
    <h2 class="page-title">管理总览</h2>

    <div class="stats-grid" v-loading="loading">
      <el-card v-for="stat in statCards" :key="stat.label" class="stat-card" shadow="hover">
        <div class="stat-icon" :style="{ background: stat.bg }">
          <el-icon size="24" color="#fff"><component :is="stat.icon" /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </el-card>
    </div>

    <div class="grid-two">
      <el-card class="quick-card">
        <template #header><b>待办事项</b></template>
        <div class="todo-list">
          <div class="todo-item" v-if="dashboard.pendingClubs > 0" @click="router.push('/admin/clubs')">
            <el-badge :value="dashboard.pendingClubs" type="danger" />
            <span>社团审核申请待处理</span>
            <el-icon color="#c0c4cc"><ArrowRight /></el-icon>
          </div>
          <el-empty v-else description="暂无待办事项" :image-size="60" />
        </div>
      </el-card>

      <el-card class="quick-card">
        <template #header><b>快速操作</b></template>
        <div class="quick-ops">
          <el-button @click="router.push('/admin/clubs')" style="width: 100%">社团管理</el-button>
          <el-button @click="router.push('/admin/batches')" style="width: 100%">管理招新批次</el-button>
          <el-button @click="router.push('/admin/announcements')" style="width: 100%">发布公告</el-button>
          <el-button @click="router.push('/admin/statistics')" style="width: 100%">查看统计报表</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminApi } from '@/api/admin'

const router = useRouter()
const loading = ref(false)
const dashboard = ref({
  totalClubs: 0,
  pendingClubs: 0,
  totalStudents: 0,
  totalApplications: 0,
  admittedApplications: 0,
  admitRate: '0',
})

const statCards = computed(() => [
  { label: '活跃社团数', value: dashboard.value.totalClubs, icon: 'OfficeBuilding', bg: '#409eff' },
  { label: '注册学生数', value: dashboard.value.totalStudents, icon: 'UserFilled', bg: '#67c23a' },
  { label: '总报名次数', value: dashboard.value.totalApplications, icon: 'Document', bg: '#e6a23c' },
  { label: '录取率', value: dashboard.value.admitRate + '%', icon: 'Trophy', bg: '#9b59b6' },
])

onMounted(async () => {
  loading.value = true
  try {
    dashboard.value = await adminApi.getDashboard()
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page-title { font-size: 22px; font-weight: 700; margin: 0 0 24px; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.stat-card { border-radius: 12px; }
.stat-card :deep(.el-card__body) { display: flex; align-items: center; gap: 16px; padding: 20px; }
.stat-icon { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-value { font-size: 28px; font-weight: 800; color: #303133; }
.stat-label { font-size: 13px; color: #909399; margin-top: 2px; }
.grid-two { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.quick-card { border-radius: 12px; }
.todo-list { display: flex; flex-direction: column; gap: 12px; }
.todo-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px; background: #f8f9fa; cursor: pointer; font-size: 14px; }
.todo-item:hover { background: #ecf5ff; }
.todo-item :last-child { margin-left: auto; }
.quick-ops { display: flex; flex-direction: column; gap: 10px; }
</style>
