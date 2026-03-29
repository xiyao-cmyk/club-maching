<template>
  <div>
    <h2 class="page-title">统计报表</h2>

    <el-card class="stat-section" v-loading="loading">
      <template #header>
        <div class="section-header">
          <b>报名状态分布</b>
          <el-select v-model="selectedBatch" placeholder="选择批次" size="small" clearable style="width: 200px"
            @change="fetchStats">
            <el-option v-for="b in batches" :key="b.id" :value="b.id" :label="b.name" />
          </el-select>
        </div>
      </template>

      <div class="status-stat-grid">
        <div
          v-for="s in statusStats"
          :key="s.status"
          class="status-stat-card"
          :style="{ borderLeft: `4px solid ${statusColor(s.status)}` }"
        >
          <div class="stat-count">{{ s.count }}</div>
          <div class="stat-name">{{ statusLabel(s.status) }}</div>
        </div>
      </div>

      <div class="total-row">
        <el-text type="info">合计报名：{{ totalApplications }} 次</el-text>
        <el-text type="success" style="margin-left: 24px">
          录取率：{{ admitRate }}%
        </el-text>
      </div>
    </el-card>

    <el-card class="stat-section">
      <template #header><b>平台数据概览</b></template>
      <div class="overview-grid">
        <div class="overview-item">
          <el-icon size="32" color="#409EFF"><OfficeBuilding /></el-icon>
          <div class="overview-value">{{ platformStats.totalClubs }}</div>
          <div class="overview-label">活跃社团</div>
        </div>
        <div class="overview-item">
          <el-icon size="32" color="#67c23a"><UserFilled /></el-icon>
          <div class="overview-value">{{ platformStats.totalStudents }}</div>
          <div class="overview-label">注册学生</div>
        </div>
        <div class="overview-item">
          <el-icon size="32" color="#e6a23c"><Document /></el-icon>
          <div class="overview-value">{{ platformStats.totalApplications }}</div>
          <div class="overview-label">累计报名</div>
        </div>
        <div class="overview-item">
          <el-icon size="32" color="#f56c6c"><Trophy /></el-icon>
          <div class="overview-value">{{ platformStats.admittedApplications }}</div>
          <div class="overview-label">累计录取</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { adminApi } from '@/api/admin'

const loading = ref(false)
const batches = ref<any[]>([])
const selectedBatch = ref<number | undefined>(undefined)
const statusStats = ref<Array<{ status: string; count: string }>>([])
const platformStats = ref({ totalClubs: 0, totalStudents: 0, totalApplications: 0, admittedApplications: 0, admitRate: '0' })

const totalApplications = computed(() => statusStats.value.reduce((sum, s) => sum + +s.count, 0))
const admitRate = computed(() => {
  const admitted = statusStats.value.find(s => s.status === 'admitted')
  if (!totalApplications.value || !admitted) return 0
  return ((+admitted.count / totalApplications.value) * 100).toFixed(1)
})

onMounted(async () => {
  loading.value = true
  try {
    const [batchData, dash] = await Promise.all([
      adminApi.getBatches(),
      adminApi.getDashboard(),
    ])
    batches.value = batchData
    platformStats.value = dash
    await fetchStats()
  } finally {
    loading.value = false
  }
})

async function fetchStats() {
  statusStats.value = await adminApi.getApplicationStats(selectedBatch.value)
}

function statusLabel(s: string) {
  const map: Record<string, string> = {
    pending: '待审核', reviewing: '审核中', interview: '待面试',
    admitted: '已录取', rejected: '未通过', withdrawn: '已撤回',
  }
  return map[s] ?? s
}

function statusColor(s: string) {
  const map: Record<string, string> = {
    pending: '#909399', reviewing: '#e6a23c', interview: '#409eff',
    admitted: '#67c23a', rejected: '#f56c6c', withdrawn: '#c0c4cc',
  }
  return map[s] ?? '#409eff'
}
</script>

<style scoped>
.page-title { font-size: 22px; font-weight: 700; margin: 0 0 24px; }
.stat-section { border-radius: 12px; margin-bottom: 24px; }
.section-header { display: flex; justify-content: space-between; align-items: center; }

.status-stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}
.status-stat-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}
.stat-count { font-size: 32px; font-weight: 800; color: #303133; }
.stat-name { font-size: 13px; color: #909399; margin-top: 4px; }
.total-row { padding-top: 12px; border-top: 1px solid #eee; }

.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.overview-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}
.overview-value { font-size: 28px; font-weight: 800; color: #303133; }
.overview-label { font-size: 13px; color: #909399; }
</style>
