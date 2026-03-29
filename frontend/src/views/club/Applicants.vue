<template>
  <div>
    <div class="page-header">
      <h2>报名名单</h2>
      <el-select v-model="statusFilter" placeholder="筛选状态" clearable size="small" style="width: 140px">
        <el-option value="pending" label="待审核" />
        <el-option value="reviewing" label="审核中" />
        <el-option value="interview" label="待面试" />
        <el-option value="admitted" label="已录取" />
        <el-option value="rejected" label="未通过" />
      </el-select>
    </div>

    <el-card style="border-radius: 12px" v-loading="loading">
      <el-table :data="filteredApplications" stripe>
        <el-table-column label="姓名" width="100">
          <template #default="{ row }">{{ row.user?.name }}</template>
        </el-table-column>
        <el-table-column label="邮箱" width="180">
          <template #default="{ row }">{{ row.user?.email }}</template>
        </el-table-column>
        <el-table-column label="报名时间" width="160">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="申请动机" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">{{ row.motivation || '-' }}</template>
        </el-table-column>
        <el-table-column label="评分" width="120">
          <template #default="{ row }">
            <el-rate v-if="row.score" :model-value="row.score / 20" disabled size="small" />
            <span v-else style="color:#c0c4cc">未评分</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small" round>{{ statusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button-group size="small">
              <el-button @click="openScore(row)">评分</el-button>
              <el-button type="success" @click="updateStatus(row, 'admitted')">录取</el-button>
              <el-button type="danger" @click="updateStatus(row, 'rejected')">淘汰</el-button>
              <el-button type="warning" @click="openInterview(row)">面试</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 评分弹窗 -->
    <el-dialog v-model="showScore" title="给候选人评分" width="400px">
      <el-form :model="scoreForm" label-width="80px">
        <el-form-item label="综合评分">
          <el-rate v-model="scoreForm.rateValue" :max="5" show-score />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="scoreForm.remark" type="textarea" :rows="3" placeholder="可填写对该候选人的评价" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showScore = false">取消</el-button>
        <el-button type="primary" :loading="actionLoading" @click="saveScore">保存</el-button>
      </template>
    </el-dialog>

    <!-- 面试安排弹窗 -->
    <el-dialog v-model="showInterview" title="安排面试" width="480px">
      <el-form :model="interviewForm" label-width="80px">
        <el-form-item label="面试时间">
          <el-date-picker v-model="interviewForm.interviewTime" type="datetime" placeholder="选择面试时间" style="width: 100%" />
        </el-form-item>
        <el-form-item label="面试地点">
          <el-input v-model="interviewForm.location" placeholder="如：图书馆二楼会议室" />
        </el-form-item>
        <el-form-item label="线上链接">
          <el-input v-model="interviewForm.onlineLink" placeholder="线上面试链接（可选）" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="interviewForm.notes" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showInterview = false">取消</el-button>
        <el-button type="primary" :loading="actionLoading" @click="saveInterview">确认安排</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { clubsApi } from '@/api/clubs'
import { applicationsApi } from '@/api/applications'
import type { Application } from '@/types'

const loading = ref(false)
const actionLoading = ref(false)
const applications = ref<Application[]>([])
const statusFilter = ref('')
const showScore = ref(false)
const showInterview = ref(false)
const selectedApp = ref<Application | null>(null)

const scoreForm = reactive({ rateValue: 3, remark: '' })
const interviewForm = reactive({ interviewTime: '', location: '', onlineLink: '', notes: '' })

const filteredApplications = computed(() =>
  statusFilter.value
    ? applications.value.filter(a => a.status === statusFilter.value)
    : applications.value
)

onMounted(fetchData)

async function fetchData() {
  loading.value = true
  try {
    const [club, batch] = await Promise.all([
      clubsApi.getMyClub(),
      applicationsApi.getActiveBatch(),
    ])
    if (club && batch) {
      applications.value = await applicationsApi.getClubApplications(club.id, batch.id)
    }
  } finally {
    loading.value = false
  }
}

function openScore(row: Application) {
  selectedApp.value = row
  scoreForm.rateValue = row.score ? row.score / 20 : 3
  scoreForm.remark = row.remark ?? ''
  showScore.value = true
}

function openInterview(row: Application) {
  selectedApp.value = row
  showInterview.value = true
}

async function saveScore() {
  if (!selectedApp.value) return
  actionLoading.value = true
  try {
    await applicationsApi.updateStatus(selectedApp.value.id, {
      status: selectedApp.value.status === 'pending' ? 'reviewing' : selectedApp.value.status,
      score: scoreForm.rateValue * 20,
      remark: scoreForm.remark,
    })
    ElMessage.success('评分已保存')
    showScore.value = false
    fetchData()
  } finally {
    actionLoading.value = false
  }
}

async function updateStatus(row: Application, status: string) {
  actionLoading.value = true
  try {
    await applicationsApi.updateStatus(row.id, { status })
    ElMessage.success('状态已更新')
    fetchData()
  } finally {
    actionLoading.value = false
  }
}

async function saveInterview() {
  if (!selectedApp.value || !interviewForm.interviewTime) {
    ElMessage.warning('请选择面试时间')
    return
  }
  actionLoading.value = true
  try {
    await applicationsApi.scheduleInterview(selectedApp.value.id, interviewForm)
    ElMessage.success('面试安排成功，通知已发送')
    showInterview.value = false
    fetchData()
  } finally {
    actionLoading.value = false
  }
}

function statusLabel(s: string) {
  const map: Record<string, string> = {
    pending: '待审核', reviewing: '审核中', interview: '待面试',
    admitted: '已录取', rejected: '未通过', withdrawn: '已撤回',
  }
  return map[s] ?? s
}

function statusType(s: string) {
  const map: Record<string, string> = {
    pending: 'info', reviewing: 'warning', interview: 'warning',
    admitted: 'success', rejected: 'danger', withdrawn: 'info',
  }
  return map[s] ?? 'info'
}

function formatDate(d: string) {
  return new Date(d).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-header h2 { margin: 0; font-size: 22px; font-weight: 700; }
</style>
