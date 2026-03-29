<template>
  <div>
    <div class="page-header">
      <h2>招新批次管理</h2>
      <el-button type="primary" @click="openCreate">+ 新建批次</el-button>
    </div>

    <el-card style="border-radius: 12px" v-loading="loading">
      <el-table :data="batches" stripe>
        <el-table-column label="批次名称" min-width="180" prop="name" />
        <el-table-column label="开始日期" width="130" prop="startDate" />
        <el-table-column label="结束日期" width="130" prop="endDate" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="batchStatusType(row.status)" size="small" round>{{ batchStatusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button-group size="small">
              <el-button @click="setStatus(row, 'active')" :disabled="row.status === 'active'">开启</el-button>
              <el-button @click="setStatus(row, 'ended')" :disabled="row.status === 'ended'">结束</el-button>
              <el-button @click="setStatus(row, 'upcoming')" :disabled="row.status === 'upcoming'">重置</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="showCreate" title="新建招新批次" width="480px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="批次名称">
          <el-input v-model="form.name" placeholder="如：2026年秋季招新" />
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker v-model="form.startDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="form.endDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="form.description" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreate = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="createBatch">创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { adminApi } from '@/api/admin'

const loading = ref(false)
const saving = ref(false)
const batches = ref<any[]>([])
const showCreate = ref(false)
const form = reactive({ name: '', startDate: '', endDate: '', description: '' })

onMounted(fetchBatches)

async function fetchBatches() {
  loading.value = true
  try {
    batches.value = await adminApi.getBatches()
  } finally {
    loading.value = false
  }
}

function openCreate() {
  Object.assign(form, { name: '', startDate: '', endDate: '', description: '' })
  showCreate.value = true
}

async function createBatch() {
  if (!form.name || !form.startDate || !form.endDate) {
    ElMessage.warning('请填写完整信息')
    return
  }
  saving.value = true
  try {
    await adminApi.createBatch({ ...form, status: 'upcoming' })
    ElMessage.success('批次创建成功')
    showCreate.value = false
    fetchBatches()
  } finally {
    saving.value = false
  }
}

async function setStatus(row: any, status: string) {
  await adminApi.updateBatch(row.id, { status })
  ElMessage.success('状态已更新')
  fetchBatches()
}

function batchStatusLabel(s: string) {
  return { upcoming: '即将开始', active: '进行中', ended: '已结束' }[s] ?? s
}
function batchStatusType(s: string) {
  return { upcoming: 'info', active: 'success', ended: 'info' }[s] ?? 'info'
}
</script>

<style scoped>
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-header h2 { margin: 0; font-size: 22px; font-weight: 700; }
</style>
