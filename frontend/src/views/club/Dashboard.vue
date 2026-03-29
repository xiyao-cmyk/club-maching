<template>
  <div>
    <div class="page-header">
      <h2>数据看板</h2>
      <el-tag type="success" v-if="club">{{ club.name }}</el-tag>
    </div>

    <div v-loading="loading">
      <el-empty v-if="!club" description="暂无社团信息，请先完善社团主页">
        <el-button type="primary" @click="router.push('/club/profile')">创建社团主页</el-button>
      </el-empty>

      <template v-else>
        <!-- 统计卡片 -->
        <div class="stats-grid">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-value blue">{{ stats.total }}</div>
            <div class="stat-label">收到报名</div>
          </el-card>
          <el-card class="stat-card" shadow="hover">
            <div class="stat-value orange">{{ stats.pending + stats.reviewing }}</div>
            <div class="stat-label">待处理</div>
          </el-card>
          <el-card class="stat-card" shadow="hover">
            <div class="stat-value green">{{ stats.admitted }}</div>
            <div class="stat-label">已录取</div>
          </el-card>
          <el-card class="stat-card" shadow="hover">
            <div class="stat-value purple">{{ club.viewCount }}</div>
            <div class="stat-label">社团浏览量</div>
          </el-card>
        </div>

        <!-- 招新进度 -->
        <el-card class="progress-card">
          <template #header><b>招新进度</b></template>
          <div class="progress-row">
            <span>录取进度</span>
            <el-progress
              :percentage="admitRate"
              :format="() => `${stats.admitted}/${config?.quota ?? '不限'}`"
              style="flex: 1; margin: 0 16px"
            />
          </div>
          <div class="status-breakdown">
            <div class="status-item">
              <el-badge :value="stats.pending" type="info" />
              <span>待审核</span>
            </div>
            <div class="status-item">
              <el-badge :value="stats.reviewing" type="warning" />
              <span>审核中</span>
            </div>
            <div class="status-item">
              <el-badge :value="stats.interview" type="warning" />
              <span>待面试</span>
            </div>
            <div class="status-item">
              <el-badge :value="stats.admitted" type="success" />
              <span>已录取</span>
            </div>
            <div class="status-item">
              <el-badge :value="stats.rejected" type="danger" />
              <span>未通过</span>
            </div>
          </div>
        </el-card>

        <div class="quick-actions">
          <el-button type="primary" @click="router.push('/club/applicants')">
            <el-icon><User /></el-icon>管理报名名单
          </el-button>
          <el-button @click="router.push('/club/recruitment')">
            <el-icon><Setting /></el-icon>招新配置
          </el-button>
          <el-button @click="router.push('/club/interviews')">
            <el-icon><Calendar /></el-icon>面试安排
          </el-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { clubsApi } from '@/api/clubs'
import { applicationsApi } from '@/api/applications'
import type { Club, ClubRecruitmentConfig } from '@/types'

const router = useRouter()
const loading = ref(false)
const club = ref<Club | null>(null)
const config = ref<ClubRecruitmentConfig | null>(null)
const applications = ref<any[]>([])

const stats = computed(() => ({
  total: applications.value.length,
  pending: applications.value.filter(a => a.status === 'pending').length,
  reviewing: applications.value.filter(a => a.status === 'reviewing').length,
  interview: applications.value.filter(a => a.status === 'interview').length,
  admitted: applications.value.filter(a => a.status === 'admitted').length,
  rejected: applications.value.filter(a => a.status === 'rejected').length,
}))

const admitRate = computed(() => {
  const quota = config.value?.quota
  if (!quota || stats.value.total === 0) return 0
  return Math.min(100, Math.round((stats.value.admitted / quota) * 100))
})

onMounted(async () => {
  loading.value = true
  try {
    club.value = await clubsApi.getMyClub()
    if (club.value) {
      const [batch, cfg] = await Promise.all([
        applicationsApi.getActiveBatch(),
        clubsApi.getRecruitmentConfig(club.value.id),
      ])
      config.value = cfg
      if (batch) {
        applications.value = await applicationsApi.getClubApplications(club.value.id, batch.id)
      }
    }
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
.page-header h2 { margin: 0; font-size: 22px; font-weight: 700; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.stat-card { border-radius: 12px; text-align: center; padding: 8px; }
.stat-value { font-size: 36px; font-weight: 800; margin-bottom: 4px; }
.blue { color: #409eff; }
.orange { color: #e6a23c; }
.green { color: #67c23a; }
.purple { color: #9b59b6; }
.stat-label { font-size: 13px; color: #909399; }
.progress-card { border-radius: 12px; margin-bottom: 24px; }
.progress-row { display: flex; align-items: center; margin-bottom: 20px; font-size: 14px; color: #606266; }
.status-breakdown { display: flex; gap: 32px; }
.status-item { display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 13px; color: #606266; }
.quick-actions { display: flex; gap: 12px; }
</style>
