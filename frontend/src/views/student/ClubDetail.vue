<template>
  <div class="page-container" v-loading="loading">
    <div v-if="club" class="detail-layout">
      <!-- 封面区 -->
      <div class="cover-section" :style="coverStyle">
        <div class="cover-overlay">
          <el-button @click="router.back()" circle class="back-btn">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <div class="cover-info">
            <el-avatar :size="72" :src="club.logo" class="club-avatar">
              {{ club.name.charAt(0) }}
            </el-avatar>
            <div>
              <h1>{{ club.name }}</h1>
              <p>{{ club.slogan }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <!-- 左侧主内容 -->
        <div class="main-content">
          <!-- 基本信息 -->
          <el-card class="info-card">
            <div class="info-grid">
              <div class="info-item">
                <el-icon color="#409EFF"><User /></el-icon>
                <div>
                  <div class="info-label">成员人数</div>
                  <div class="info-value">{{ club.memberCount }} 人</div>
                </div>
              </div>
              <div class="info-item" v-if="club.activityFrequency">
                <el-icon color="#67c23a"><Clock /></el-icon>
                <div>
                  <div class="info-label">活动频率</div>
                  <div class="info-value">{{ club.activityFrequency }}</div>
                </div>
              </div>
              <div class="info-item" v-if="club.foundedYear">
                <el-icon color="#e6a23c"><Calendar /></el-icon>
                <div>
                  <div class="info-label">成立年份</div>
                  <div class="info-value">{{ club.foundedYear }} 年</div>
                </div>
              </div>
              <div class="info-item" v-if="club.category">
                <el-icon color="#909399"><Grid /></el-icon>
                <div>
                  <div class="info-label">社团类别</div>
                  <div class="info-value">{{ club.category.name }}</div>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 社团介绍 -->
          <el-card class="info-card">
            <template #header><b>社团介绍</b></template>
            <p class="description">{{ club.description }}</p>
          </el-card>

          <!-- 标签 -->
          <el-card class="info-card" v-if="club.tags?.length">
            <template #header><b>标签</b></template>
            <div class="tags-section">
              <div v-for="type in tagTypes" :key="type.key">
                <div class="tag-group" v-if="tagsByType(type.key).length">
                  <span class="tag-label">{{ type.label }}</span>
                  <el-tag
                    v-for="tag in tagsByType(type.key)"
                    :key="tag.id"
                    :type="type.elType as any"
                    round
                    effect="light"
                    size="small"
                  >{{ tag.tag }}</el-tag>
                </div>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 右侧：招新信息 & 报名 -->
        <div class="side-content">
          <el-card v-if="club.recruitmentConfig" class="apply-card">
            <template #header>
              <div class="apply-header">
                <b>招新信息</b>
                <el-tag type="success">招新中</el-tag>
              </div>
            </template>

            <div class="recruitment-info">
              <div class="r-item">
                <span class="r-label">招生名额</span>
                <span>{{ club.recruitmentConfig.quota ?? '不限' }}</span>
              </div>
              <div class="r-item">
                <span class="r-label">考核强度</span>
                <el-rate
                  :model-value="club.recruitmentConfig.assessmentIntensity"
                  :max="5"
                  disabled
                  size="small"
                />
              </div>
              <div class="r-item">
                <span class="r-label">面试环节</span>
                <span>{{ club.recruitmentConfig.hasInterview ? '有面试' : '无面试' }}</span>
              </div>
              <div class="r-item">
                <span class="r-label">接受零基础</span>
                <el-tag :type="club.recruitmentConfig.acceptBeginner ? 'success' : 'warning'" size="small">
                  {{ club.recruitmentConfig.acceptBeginner ? '欢迎' : '需有基础' }}
                </el-tag>
              </div>
            </div>

            <div v-if="club.recruitmentConfig.requirements" class="requirements">
              <div class="r-label">招新要求</div>
              <p>{{ club.recruitmentConfig.requirements }}</p>
            </div>

            <div class="apply-actions">
              <el-button
                v-if="!applied"
                type="primary"
                size="large"
                style="width: 100%"
                @click="showApplyDialog = true"
              >立即报名</el-button>
              <el-button
                v-else
                type="success"
                size="large"
                style="width: 100%"
                disabled
              >已报名</el-button>
              <el-button
                :icon="favorited ? 'StarFilled' : 'Star'"
                :type="favorited ? 'warning' : 'default'"
                size="large"
                style="width: 100%; margin-top: 8px"
                @click="toggleFavorite"
              >{{ favorited ? '已收藏' : '收藏社团' }}</el-button>
            </div>
          </el-card>

          <el-card v-else class="apply-card">
            <el-empty description="暂无开放招新" />
          </el-card>

          <!-- 联系方式 -->
          <el-card class="contact-card" v-if="club.contactEmail || club.contactQq">
            <template #header><b>联系方式</b></template>
            <div class="contact-info">
              <div v-if="club.contactEmail" class="contact-item">
                <el-icon><Message /></el-icon>
                {{ club.contactEmail }}
              </div>
              <div v-if="club.contactQq" class="contact-item">
                <el-icon><ChatDotRound /></el-icon>
                QQ: {{ club.contactQq }}
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>

    <!-- 报名弹窗 -->
    <el-dialog v-model="showApplyDialog" title="填写报名信息" width="520px">
      <el-form :model="applyForm" label-width="80px">
        <el-form-item label="申请动机">
          <el-input
            v-model="applyForm.motivation"
            type="textarea"
            :rows="4"
            placeholder="简单介绍你为什么想加入这个社团，以及你能带来什么..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showApplyDialog = false">取消</el-button>
        <el-button type="primary" :loading="applying" @click="submitApply">确认报名</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { clubsApi } from '@/api/clubs'
import { applicationsApi } from '@/api/applications'
import { favoritesApi } from '@/api/favorites'
import type { Club, ClubTag } from '@/types'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const club = ref<Club | null>(null)
const showApplyDialog = ref(false)
const applying = ref(false)
const applied = ref(false)
const favorited = ref(false)
const activeBatch = ref<any>(null)
const applyForm = reactive({ motivation: '' })

const coverStyle = computed(() => ({
  background: club.value?.cover
    ? `url(${club.value.cover}) center/cover`
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}))

const tagTypes = [
  { key: 'interest', label: '兴趣方向', elType: 'primary' },
  { key: 'skill', label: '技能要求', elType: 'success' },
  { key: 'goal', label: '活动目标', elType: 'warning' },
  { key: 'requirement', label: '招新要求', elType: 'info' },
]

function tagsByType(type: string) {
  return (club.value?.tags ?? []).filter((t) => t.tagType === type)
}

onMounted(async () => {
  loading.value = true
  try {
    const [clubData, batch] = await Promise.all([
      clubsApi.getOne(+route.params.id),
      applicationsApi.getActiveBatch(),
    ])
    club.value = clubData
    activeBatch.value = batch

    const [myApps, favCheck] = await Promise.all([
      applicationsApi.getMyApplications(),
      favoritesApi.check(clubData.id),
    ])
    applied.value = myApps.some((a: any) => a.clubId === clubData.id)
    favorited.value = favCheck.favorited

    await clubsApi.recordBehavior(clubData.id, 'view').catch(() => {})
  } finally {
    loading.value = false
  }
})

async function toggleFavorite() {
  if (favorited.value) {
    await favoritesApi.remove(club.value!.id)
    favorited.value = false
    ElMessage.success('已取消收藏')
  } else {
    await favoritesApi.add(club.value!.id)
    favorited.value = true
    ElMessage.success('收藏成功')
  }
}

async function submitApply() {
  if (!activeBatch.value) {
    ElMessage.error('当前无活跃招新批次')
    return
  }
  applying.value = true
  try {
    await applicationsApi.apply({
      clubId: club.value!.id,
      batchId: activeBatch.value.id,
      motivation: applyForm.motivation,
    })
    applied.value = true
    showApplyDialog.value = false
    ElMessage.success('报名成功！')
  } finally {
    applying.value = false
  }
}
</script>

<style scoped>
.detail-layout { max-width: 1100px; margin: 0 auto; }
.cover-section {
  height: 280px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;
  position: relative;
}
.cover-overlay {
  height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
}
.back-btn { opacity: 0.9; }
.cover-info {
  display: flex;
  align-items: center;
  gap: 20px;
}
.club-avatar { font-size: 28px; font-weight: 700; color: #fff; background: #409eff; }
.cover-info h1 { color: #fff; font-size: 28px; margin: 0 0 4px; }
.cover-info p { color: rgba(255,255,255,0.8); margin: 0; font-size: 14px; }

.content-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
}
.info-card { margin-bottom: 16px; border-radius: 12px; }
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
.info-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.info-label { font-size: 12px; color: #909399; }
.info-value { font-size: 14px; font-weight: 600; color: #303133; }

.description { color: #606266; line-height: 1.8; margin: 0; white-space: pre-wrap; }

.tags-section { display: flex; flex-direction: column; gap: 12px; }
.tag-group { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.tag-label { font-size: 12px; color: #909399; white-space: nowrap; margin-right: 4px; }

.apply-card { border-radius: 12px; margin-bottom: 16px; position: sticky; top: 80px; }
.apply-header { display: flex; justify-content: space-between; align-items: center; }
.recruitment-info { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
.r-item { display: flex; justify-content: space-between; align-items: center; font-size: 14px; }
.r-label { color: #909399; }
.requirements { background: #f8f9fa; border-radius: 8px; padding: 12px; margin-bottom: 16px; }
.requirements p { margin: 6px 0 0; font-size: 13px; color: #606266; }
.apply-actions { margin-top: 16px; }

.contact-card { border-radius: 12px; }
.contact-info { display: flex; flex-direction: column; gap: 10px; }
.contact-item { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #606266; }
</style>
