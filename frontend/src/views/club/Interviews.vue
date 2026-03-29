<template>
  <div>
    <h2 class="page-title">面试安排</h2>

    <el-card style="border-radius: 12px" v-loading="loading">
      <el-empty v-if="interviews.length === 0" description="暂无面试安排" />

      <el-timeline v-else>
        <el-timeline-item
          v-for="item in interviews"
          :key="item.id"
          :timestamp="formatDate(item.interview.interviewTime)"
          placement="top"
          :type="timelineType(item.interview.result)"
        >
          <el-card class="interview-card" shadow="never">
            <div class="interview-header">
              <div class="applicant-info">
                <el-avatar :size="36">{{ item.user?.name?.charAt(0) }}</el-avatar>
                <div>
                  <div class="applicant-name">{{ item.user?.name }}</div>
                  <div class="applicant-email">{{ item.user?.email }}</div>
                </div>
              </div>
              <el-tag :type="resultType(item.interview.result)" size="small">
                {{ resultLabel(item.interview.result) }}
              </el-tag>
            </div>

            <div class="interview-details">
              <span v-if="item.interview.location">
                <el-icon><Location /></el-icon>{{ item.interview.location }}
              </span>
              <el-link v-if="item.interview.onlineLink" :href="item.interview.onlineLink" type="primary" target="_blank">
                <el-icon><Link /></el-icon>线上链接
              </el-link>
            </div>

            <div class="interview-actions">
              <el-button
                size="small"
                type="success"
                @click="setResult(item, 'pass')"
                :disabled="item.interview.result !== 'pending'"
              >面试通过</el-button>
              <el-button
                size="small"
                type="danger"
                @click="setResult(item, 'fail')"
                :disabled="item.interview.result !== 'pending'"
              >面试未通过</el-button>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { clubsApi } from '@/api/clubs'
import { applicationsApi } from '@/api/applications'

const loading = ref(false)
const interviews = ref<any[]>([])

onMounted(fetchData)

async function fetchData() {
  loading.value = true
  try {
    const [club, batch] = await Promise.all([
      clubsApi.getMyClub(),
      applicationsApi.getActiveBatch(),
    ])
    if (club && batch) {
      const apps = await applicationsApi.getClubApplications(club.id, batch.id)
      interviews.value = apps
        .filter((a: any) => a.status === 'interview' && a.interview)
        .sort((a: any, b: any) => new Date(a.interview.interviewTime).getTime() - new Date(b.interview.interviewTime).getTime())
    }
  } finally {
    loading.value = false
  }
}

async function setResult(item: any, result: 'pass' | 'fail') {
  const status = result === 'pass' ? 'admitted' : 'rejected'
  await applicationsApi.updateStatus(item.id, { status })
  ElMessage.success(result === 'pass' ? '已录取该候选人' : '已淘汰该候选人')
  fetchData()
}

function formatDate(d: string) {
  return new Date(d).toLocaleString('zh-CN', {
    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  })
}

function timelineType(result: string) {
  if (result === 'pass') return 'success'
  if (result === 'fail') return 'danger'
  return 'primary'
}

function resultType(result: string) {
  if (result === 'pass') return 'success'
  if (result === 'fail') return 'danger'
  return 'info'
}

function resultLabel(result: string) {
  return result === 'pass' ? '通过' : result === 'fail' ? '未通过' : '待结果'
}
</script>

<style scoped>
.page-title { font-size: 22px; font-weight: 700; margin: 0 0 20px; }
.interview-card { border-radius: 10px; }
.interview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.applicant-info { display: flex; align-items: center; gap: 10px; }
.applicant-name { font-size: 14px; font-weight: 600; }
.applicant-email { font-size: 12px; color: #909399; }
.interview-details { display: flex; gap: 16px; font-size: 13px; color: #606266; margin-bottom: 12px; align-items: center; }
.interview-details span { display: flex; align-items: center; gap: 4px; }
.interview-actions { display: flex; gap: 8px; }
</style>
