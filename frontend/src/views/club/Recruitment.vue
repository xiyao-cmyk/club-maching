<template>
  <div>
    <h2 class="page-title">招新配置</h2>

    <el-card class="config-card" v-loading="loading">
      <el-alert v-if="!batchId" type="warning" show-icon :closable="false" style="margin-bottom: 20px">
        当前没有活跃的招新批次，请联系管理员创建招新批次后再配置。
      </el-alert>

      <el-form :model="form" label-width="120px">
        <el-form-item label="招新状态">
          <el-select v-model="form.status" style="width: 200px">
            <el-option value="draft" label="草稿（不对外展示）" />
            <el-option value="published" label="发布（对外招新）" />
            <el-option value="closed" label="关闭招新" />
          </el-select>
        </el-form-item>

        <el-form-item label="招生名额">
          <el-input-number v-model="form.quota" :min="1" placeholder="留空为不限" :controls="false" style="width: 120px" />
          <el-text type="info" size="small" style="margin-left: 8px">留空表示不限人数</el-text>
        </el-form-item>

        <el-form-item label="招新要求">
          <el-input v-model="form.requirements" type="textarea" :rows="4" placeholder="描述对报名成员的要求" />
        </el-form-item>

        <el-form-item label="接受零基础">
          <el-switch v-model="form.acceptBeginner" />
        </el-form-item>

        <el-form-item label="考核强度">
          <el-slider v-model="form.assessmentIntensity" :min="1" :max="5" :step="1" show-stops style="width: 300px" />
          <div class="intensity-labels">
            <span>轻松</span><span>中等</span><span>较高</span><span>严格</span><span>极严</span>
          </div>
        </el-form-item>

        <el-form-item label="是否有面试">
          <el-switch v-model="form.hasInterview" />
        </el-form-item>

        <el-divider>技能要求标签</el-divider>

        <el-form-item label="要求技能">
          <div class="skills-editor">
            <el-tag
              v-for="(s, i) in form.skillRequirements"
              :key="i"
              closable
              @close="removeSkill(i)"
              type="success"
              size="small"
            >{{ s }}</el-tag>
            <el-input
              v-model="newSkill"
              size="small"
              placeholder="+ 添加技能"
              style="width: 100px"
              @keyup.enter="addSkill"
              @blur="addSkill"
            />
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="saving" :disabled="!batchId" @click="save">保存配置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { clubsApi } from '@/api/clubs'
import { applicationsApi } from '@/api/applications'

const loading = ref(false)
const saving = ref(false)
const batchId = ref<number | null>(null)
const clubId = ref<number | null>(null)
const newSkill = ref('')

const form = reactive({
  status: 'draft' as 'draft' | 'published' | 'closed',
  quota: undefined as number | undefined,
  requirements: '',
  acceptBeginner: true,
  assessmentIntensity: 2,
  hasInterview: true,
  skillRequirements: [] as string[],
})

onMounted(async () => {
  loading.value = true
  try {
    const [club, batch] = await Promise.all([
      clubsApi.getMyClub(),
      applicationsApi.getActiveBatch(),
    ])
    if (club) {
      clubId.value = club.id
    }
    if (batch) {
      batchId.value = batch.id
      if (club) {
        const config = await clubsApi.getRecruitmentConfig(club.id, batch.id)
        if (config) {
          Object.assign(form, {
            status: config.status,
            quota: config.quota,
            requirements: config.requirements,
            acceptBeginner: config.acceptBeginner,
            assessmentIntensity: config.assessmentIntensity,
            hasInterview: config.hasInterview,
            skillRequirements: config.skillRequirements ?? [],
          })
        }
      }
    }
  } finally {
    loading.value = false
  }
})

function addSkill() {
  const v = newSkill.value.trim()
  if (v && !form.skillRequirements.includes(v)) {
    form.skillRequirements.push(v)
  }
  newSkill.value = ''
}

function removeSkill(i: number) {
  form.skillRequirements.splice(i, 1)
}

async function save() {
  if (!clubId.value || !batchId.value) return
  saving.value = true
  try {
    await clubsApi.upsertRecruitmentConfig(clubId.value, {
      ...form,
      batchId: batchId.value,
    })
    ElMessage.success('招新配置已保存')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.page-title { font-size: 22px; font-weight: 700; margin: 0 0 20px; }
.config-card { border-radius: 12px; max-width: 700px; }
.skills-editor { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.intensity-labels {
  display: flex;
  justify-content: space-between;
  width: 300px;
  font-size: 11px;
  color: #c0c4cc;
  margin-top: 2px;
}
</style>
