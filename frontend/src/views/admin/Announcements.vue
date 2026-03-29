<template>
  <div>
    <div class="page-header">
      <h2>公告管理</h2>
      <el-button type="primary" @click="openCreate">+ 新建公告</el-button>
    </div>

    <el-card style="border-radius: 12px" v-loading="loading">
      <el-table :data="announcements" stripe>
        <el-table-column label="标题" min-width="200" prop="title" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'info'" size="small">{{ row.isActive ? '显示中' : '已隐藏' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="80" prop="sortOrder" />
        <el-table-column label="创建时间" width="140">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button-group size="small">
              <el-button @click="openEdit(row)">编辑</el-button>
              <el-button @click="toggleActive(row)">
                {{ row.isActive ? '隐藏' : '显示' }}
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="showDialog" :title="editingId ? '编辑公告' : '新建公告'" width="540px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.content" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" :controls="false" style="width: 100px" />
          <el-text type="info" size="small" style="margin-left: 8px">数字越大越靠前</el-text>
        </el-form-item>
        <el-form-item label="显示">
          <el-switch v-model="form.isActive" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="save">保存</el-button>
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
const announcements = ref<any[]>([])
const showDialog = ref(false)
const editingId = ref<number | null>(null)
const form = reactive({ title: '', content: '', sortOrder: 0, isActive: true })

onMounted(fetchAnnouncements)

async function fetchAnnouncements() {
  loading.value = true
  try {
    announcements.value = await adminApi.getAnnouncements()
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingId.value = null
  Object.assign(form, { title: '', content: '', sortOrder: 0, isActive: true })
  showDialog.value = true
}

function openEdit(row: any) {
  editingId.value = row.id
  Object.assign(form, { title: row.title, content: row.content, sortOrder: row.sortOrder, isActive: row.isActive })
  showDialog.value = true
}

async function save() {
  if (!form.title || !form.content) {
    ElMessage.warning('请填写标题和内容')
    return
  }
  saving.value = true
  try {
    if (editingId.value) {
      await adminApi.updateAnnouncement(editingId.value, form)
    } else {
      await adminApi.createAnnouncement(form)
    }
    ElMessage.success('保存成功')
    showDialog.value = false
    fetchAnnouncements()
  } finally {
    saving.value = false
  }
}

async function toggleActive(row: any) {
  await adminApi.updateAnnouncement(row.id, { isActive: !row.isActive })
  fetchAnnouncements()
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-header h2 { margin: 0; font-size: 22px; font-weight: 700; }
</style>
