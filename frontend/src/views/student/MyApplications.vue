<template>
  <div class="page-container">
    <h2 class="page-title">我的报名</h2>

    <div v-loading="loading">
      <div v-if="applications.length === 0" class="empty-wrap">
        <el-empty description="你还没有报名任何社团">
          <el-button type="primary" @click="router.push('/clubs')">去逛逛社团广场</el-button>
        </el-empty>
      </div>

      <div v-else class="app-list">
        <el-card
          v-for="app in applications"
          :key="app.id"
          class="app-card"
          shadow="hover"
        >
          <div class="app-header">
            <div class="club-info" @click="router.push(`/clubs/${app.clubId}`)">
              <el-avatar :size="48" :src="app.club?.logo" class="club-avatar">
                {{ app.club?.name?.charAt(0) }}
              </el-avatar>
              <div>
                <div class="club-name">{{ app.club?.name }}</div>
                <div class="club-category">{{ app.club?.category?.name }}</div>
              </div>
            </div>

            <el-tag :type="statusType(app.status)" size="large" round>
              {{ statusLabel(app.status) }}
            </el-tag>
          </div>

          <el-divider />

          <div class="app-meta">
            <div class="meta-item">
              <span class="meta-label">招新批次</span>
              <span>{{ app.batch?.name }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">报名时间</span>
              <span>{{ formatDate(app.createdAt) }}</span>
            </div>
            <div v-if="app.score" class="meta-item">
              <span class="meta-label">综合评分</span>
              <el-rate :model-value="app.score / 20" disabled size="small" />
            </div>
          </div>

          <!-- 面试信息 -->
          <div v-if="app.interview && app.status === 'interview'" class="interview-info">
            <el-alert type="warning" :closable="false" show-icon>
              <template #title>
                面试通知：{{ formatDate(app.interview.interviewTime) }}
              </template>
              <div style="margin-top: 6px">
                <span v-if="app.interview.location">地点：{{ app.interview.location }}</span>
                <span v-if="app.interview.onlineLink">
                  链接：<el-link :href="app.interview.onlineLink" type="primary" target="_blank">点击加入</el-link>
                </span>
              </div>
            </el-alert>
          </div>

          <!-- 录取备注 -->
          <div v-if="app.remark && ['admitted', 'rejected'].includes(app.status)" class="remark-box">
            <el-text type="info" size="small">{{ app.remark }}</el-text>
          </div>

          <div class="app-actions">
            <el-button
              v-if="canWithdraw(app.status)"
              type="danger"
              plain
              size="small"
              @click="withdrawApp(app.id)"
            >撤回报名</el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { applicationsApi } from '@/api/applications'
import type { Application } from '@/types'

const router = useRouter()
const loading = ref(false)
const applications = ref<Application[]>([])

onMounted(fetchApplications)

async function fetchApplications() {
  loading.value = true
  try {
    applications.value = await applicationsApi.getMyApplications()
  } finally {
    loading.value = false
  }
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    pending: '等待审核',
    reviewing: '审核中',
    interview: '待面试',
    admitted: '已录取',
    rejected: '未通过',
    withdrawn: '已撤回',
  }
  return map[status] ?? status
}

function statusType(status: string) {
  const map: Record<string, string> = {
    pending: 'info',
    reviewing: 'warning',
    interview: 'warning',
    admitted: 'success',
    rejected: 'danger',
    withdrawn: 'info',
  }
  return map[status] ?? 'info'
}

function canWithdraw(status: string) {
  return ['pending', 'reviewing'].includes(status)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

async function withdrawApp(id: number) {
  await ElMessageBox.confirm('确定撤回此报名吗？', '提示', { type: 'warning' })
  await applicationsApi.withdraw(id)
  ElMessage.success('已撤回报名')
  fetchApplications()
}
</script>

<style scoped>
.page-title { font-size: 22px; font-weight: 700; margin: 0 0 24px; }
.empty-wrap { background: #fff; border-radius: 12px; padding: 60px; }
.app-list { display: flex; flex-direction: column; gap: 16px; }
.app-card { border-radius: 12px; }
.app-header { display: flex; justify-content: space-between; align-items: center; }
.club-info { display: flex; align-items: center; gap: 12px; cursor: pointer; }
.club-avatar { background: #409eff; color: #fff; font-weight: 700; font-size: 18px; }
.club-name { font-size: 16px; font-weight: 700; color: #303133; }
.club-category { font-size: 13px; color: #909399; }
.app-meta { display: flex; gap: 32px; flex-wrap: wrap; }
.meta-item { display: flex; align-items: center; gap: 8px; font-size: 14px; }
.meta-label { color: #909399; }
.interview-info { margin-top: 12px; }
.remark-box { margin-top: 10px; padding: 10px 14px; background: #f8f9fa; border-radius: 6px; }
.app-actions { margin-top: 12px; display: flex; justify-content: flex-end; }
</style>
