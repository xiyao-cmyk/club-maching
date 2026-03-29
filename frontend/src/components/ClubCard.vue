<template>
  <el-card
    class="club-card"
    :body-style="{ padding: 0 }"
    shadow="hover"
    @click="emit('click')"
  >
    <div class="cover-wrap">
      <img v-if="club.cover" :src="club.cover" class="cover-img" :alt="club.name" />
      <div v-else class="cover-placeholder">
        <el-icon size="48" color="rgba(255,255,255,0.6)"><OfficeBuilding /></el-icon>
      </div>
      <div v-if="score !== undefined" class="match-badge">
        <el-icon size="12"><Star /></el-icon>
        匹配度 {{ score }}%
      </div>
      <div class="category-badge" v-if="club.category">
        {{ club.category.name }}
      </div>
    </div>

    <div class="card-body">
      <div class="club-logo-row">
        <el-avatar :size="44" :src="club.logo" class="club-logo">
          {{ club.name.charAt(0) }}
        </el-avatar>
        <div class="club-meta">
          <div class="club-name">{{ club.name }}</div>
          <div class="club-slogan">{{ club.slogan ?? '欢迎加入' }}</div>
        </div>
      </div>

      <div class="club-stats">
        <span><el-icon><User /></el-icon> {{ club.memberCount }} 人</span>
        <span v-if="club.activityFrequency">
          <el-icon><Clock /></el-icon> {{ club.activityFrequency }}
        </span>
      </div>

      <div v-if="reasons && reasons.length" class="reasons">
        <div v-for="(r, i) in reasons.slice(0, 1)" :key="i" class="reason-item">
          <el-icon color="#409EFF" size="12"><InfoFilled /></el-icon>
          {{ r }}
        </div>
      </div>

      <div class="tags">
        <el-tag
          v-for="tag in (club.tags ?? []).filter(t => t.tagType === 'interest').slice(0, 3)"
          :key="tag.id"
          size="small"
          round
          effect="plain"
        >{{ tag.tag }}</el-tag>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import type { Club } from '@/types'

const props = defineProps<{
  club: Club
  score?: number
  reasons?: string[]
}>()

const emit = defineEmits<{ (e: 'click'): void }>()
</script>

<style scoped>
.club-card {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s;
}

.club-card:hover {
  transform: translateY(-4px);
}

.cover-wrap {
  position: relative;
  height: 140px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.match-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 214, 0, 0.92);
  color: #333;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 3px;
}

.category-badge {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
}

.card-body {
  padding: 16px;
}

.club-logo-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.club-logo {
  flex-shrink: 0;
  background: #409eff;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}

.club-name {
  font-size: 15px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 2px;
}

.club-slogan {
  font-size: 12px;
  color: #909399;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 160px;
}

.club-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
  align-items: center;
}

.club-stats span {
  display: flex;
  align-items: center;
  gap: 3px;
}

.reasons {
  margin-bottom: 8px;
}

.reason-item {
  font-size: 12px;
  color: #409eff;
  display: flex;
  align-items: flex-start;
  gap: 4px;
  line-height: 1.4;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}
</style>
