<template>
  <div>
    <h2 class="page-title">社团主页</h2>

    <el-card class="profile-card" v-loading="loading">
      <el-form :model="form" label-width="100px" size="default">
        <el-form-item label="社团名称">
          <el-input v-model="form.name" placeholder="请输入社团名称" />
        </el-form-item>
        <el-form-item label="社团分类">
          <el-select v-model="form.categoryId" placeholder="选择分类" style="width: 200px">
            <el-option v-for="c in categories" :key="c.id" :value="c.id" :label="c.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="社团标语">
          <el-input v-model="form.slogan" placeholder="一句话介绍社团" />
        </el-form-item>
        <el-form-item label="社团介绍">
          <el-input v-model="form.description" type="textarea" :rows="5" placeholder="详细介绍社团的历史、特色、活动等" />
        </el-form-item>
        <el-form-item label="成立年份">
          <el-input-number v-model="form.foundedYear" :min="1950" :max="2030" :controls="false" style="width: 120px" />
        </el-form-item>
        <el-form-item label="成员人数">
          <el-input-number v-model="form.memberCount" :min="0" :controls="false" style="width: 120px" />
        </el-form-item>
        <el-form-item label="活动频率">
          <el-input v-model="form.activityFrequency" placeholder="如：每周一次，每两周一次" />
        </el-form-item>
        <el-form-item label="联系邮箱">
          <el-input v-model="form.contactEmail" type="email" />
        </el-form-item>
        <el-form-item label="联系QQ">
          <el-input v-model="form.contactQq" />
        </el-form-item>

        <el-divider>社团标签</el-divider>

        <el-form-item label="标签管理">
          <div class="tags-editor">
            <div v-for="type in tagTypes" :key="type.key" class="tag-type-row">
              <span class="tag-type-label">{{ type.label }}</span>
              <el-tag
                v-for="(tag, i) in tagsByType(type.key)"
                :key="i"
                closable
                @close="removeTag(type.key, tag)"
                :type="type.elType as any"
                size="small"
              >{{ tag }}</el-tag>
              <el-input
                v-model="newTagInputs[type.key]"
                size="small"
                placeholder="+ 添加"
                style="width: 80px"
                @keyup.enter="addTag(type.key)"
                @blur="addTag(type.key)"
              />
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="saving" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { clubsApi } from '@/api/clubs'
import { useAuthStore } from '@/stores/auth'
import type { ClubCategory } from '@/types'

const auth = useAuthStore()
const loading = ref(false)
const saving = ref(false)
const categories = ref<ClubCategory[]>([])
const clubId = ref<number | null>(null)

const form = reactive({
  name: '',
  categoryId: undefined as number | undefined,
  slogan: '',
  description: '',
  foundedYear: new Date().getFullYear(),
  memberCount: 0,
  activityFrequency: '',
  contactEmail: '',
  contactQq: '',
})

const tagTypes = [
  { key: 'interest', label: '兴趣方向', elType: 'primary' },
  { key: 'skill', label: '技能要求', elType: 'success' },
  { key: 'goal', label: '活动目标', elType: 'warning' },
  { key: 'requirement', label: '招新要求', elType: 'info' },
]

const tagMap = reactive<Record<string, string[]>>({
  interest: [], skill: [], goal: [], requirement: [],
})
const newTagInputs = reactive<Record<string, string>>({
  interest: '', skill: '', goal: '', requirement: '',
})

function tagsByType(type: string) {
  return tagMap[type] ?? []
}

function addTag(type: string) {
  const val = newTagInputs[type].trim()
  if (val && !tagMap[type].includes(val)) {
    tagMap[type].push(val)
  }
  newTagInputs[type] = ''
}

function removeTag(type: string, tag: string) {
  tagMap[type] = tagMap[type].filter(t => t !== tag)
}

onMounted(async () => {
  loading.value = true
  try {
    categories.value = await clubsApi.getCategories()
    const club = await clubsApi.getMyClub()
    if (club) {
      clubId.value = club.id
      Object.assign(form, {
        name: club.name,
        categoryId: club.categoryId,
        slogan: club.slogan,
        description: club.description,
        foundedYear: club.foundedYear,
        memberCount: club.memberCount,
        activityFrequency: club.activityFrequency,
        contactEmail: club.contactEmail,
        contactQq: club.contactQq,
      })
      if (club.tags) {
        for (const t of club.tags) {
          if (!tagMap[t.tagType]) tagMap[t.tagType] = []
          tagMap[t.tagType].push(t.tag)
        }
      }
    }
  } finally {
    loading.value = false
  }
})

async function save() {
  saving.value = true
  try {
    let id = clubId.value
    if (!id) {
      const created = await clubsApi.create(form)
      id = created.id
      clubId.value = id
    } else {
      await clubsApi.update(id, form)
    }

    const allTags: Array<{ tag: string; tagType: string }> = []
    for (const type of Object.keys(tagMap)) {
      for (const tag of tagMap[type]) {
        allTags.push({ tag, tagType: type })
      }
    }
    await clubsApi.saveTags(id!, allTags)

    ElMessage.success('保存成功')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.page-title { font-size: 22px; font-weight: 700; margin: 0 0 20px; }
.profile-card { border-radius: 12px; }
.tags-editor { display: flex; flex-direction: column; gap: 12px; width: 100%; }
.tag-type-row { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.tag-type-label { font-size: 13px; color: #909399; white-space: nowrap; min-width: 64px; }
</style>
