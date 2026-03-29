<template>
  <div class="page-container home-page">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="welcome-text">
        <h2>你好，{{ auth.user?.name }} 👋</h2>
        <p v-if="!questionnaireDone">
          完成兴趣问卷，获取专属社团推荐
          <el-button type="primary" size="small" @click="router.push('/questionnaire')" style="margin-left: 12px">
            立即填写
          </el-button>
        </p>
        <p v-else>已为你生成个性化推荐，共 {{ stats.totalClubs }} 个社团正在等你</p>
      </div>
      <div class="banner-icon">
        <el-icon size="80" color="rgba(255,255,255,0.3)"><Compass /></el-icon>
      </div>
    </div>

    <!-- 公告栏 -->
    <div v-if="announcements.length" class="section">
      <el-carousel :interval="5000" height="80px" indicator-position="none" class="announcement-carousel">
        <el-carousel-item v-for="a in announcements" :key="a.id">
          <div class="announcement-item">
            <el-icon color="#e6a23c"><Bell /></el-icon>
            <span class="announcement-title">{{ a.title }}</span>
            <span class="announcement-content">{{ a.content }}</span>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 推荐社团 -->
    <div class="section">
      <div class="section-header">
        <h3>
          <el-icon color="#409EFF"><Star /></el-icon>
          为你推荐
        </h3>
        <el-link type="primary" @click="router.push('/clubs')">查看全部 →</el-link>
      </div>

      <div v-loading="loading">
        <div v-if="!questionnaireDone" class="questionnaire-prompt">
          <el-empty description="完成兴趣问卷后，系统将为你精准推荐最适合的社团">
            <el-button type="primary" @click="router.push('/questionnaire')">填写兴趣问卷</el-button>
          </el-empty>
        </div>

        <div v-else class="clubs-grid">
          <ClubCard
            v-for="item in recommended"
            :key="item.club.id"
            :club="item.club"
            :score="item.score"
            :reasons="item.reasons"
            @click="router.push(`/clubs/${item.club.id}`)"
          />
        </div>
      </div>
    </div>

    <!-- 快速入口 -->
    <div class="section quick-actions">
      <div class="quick-action" @click="router.push('/clubs')">
        <el-icon size="32" color="#409EFF"><Grid /></el-icon>
        <span>社团广场</span>
      </div>
      <div class="quick-action" @click="router.push('/questionnaire')">
        <el-icon size="32" color="#67c23a"><Finished /></el-icon>
        <span>兴趣问卷</span>
      </div>
      <div class="quick-action" @click="router.push('/my-applications')">
        <el-icon size="32" color="#e6a23c"><Document /></el-icon>
        <span>我的报名</span>
      </div>
      <div class="quick-action" @click="router.push('/notifications')">
        <el-icon size="32" color="#f56c6c"><Bell /></el-icon>
        <span>消息通知</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { recommendationApi } from '@/api/recommendation'
import ClubCard from '@/components/ClubCard.vue'
import type { RecommendedClub, Announcement } from '@/types'

const router = useRouter()
const auth = useAuthStore()

const loading = ref(false)
const recommended = ref<RecommendedClub[]>([])
const announcements = ref<Announcement[]>([])
const stats = ref({ totalClubs: 0 })
const questionnaireDone = ref(false)

onMounted(async () => {
  const [announcementsRes, statsRes] = await Promise.all([
    recommendationApi.getAnnouncements(),
    recommendationApi.getStats(),
  ])
  announcements.value = announcementsRes
  stats.value = statsRes

  loading.value = true
  try {
    const data = await recommendationApi.getRecommendations(8)
    recommended.value = data
    questionnaireDone.value = data.some((d: any) => d.score > 0 && d.reasons[0] !== '完成兴趣问卷后可获得专属推荐')
      || data.length > 0
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-banner {
  background: linear-gradient(135deg, #409EFF 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px 40px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  overflow: hidden;
  position: relative;
}

.welcome-text h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px;
}

.welcome-text p {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
}

.banner-icon {
  flex-shrink: 0;
}

.section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.announcement-carousel {
  background: #fff5e6;
  border-radius: 10px;
  border: 1px solid #fde8c0;
}

.announcement-item {
  height: 80px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  font-size: 14px;
}

.announcement-title {
  font-weight: 600;
  color: #e6a23c;
  white-space: nowrap;
}

.announcement-content {
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.clubs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.questionnaire-prompt {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.quick-action {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.quick-action:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.quick-action span {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}
</style>
