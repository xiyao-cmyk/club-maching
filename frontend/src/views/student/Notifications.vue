<template>
  <div class="page-container">
    <div class="notif-header">
      <h2>消息通知</h2>
      <el-button v-if="store.unreadCount > 0" size="small" @click="store.markAllRead()">全部已读</el-button>
    </div>

    <div v-loading="loading" class="notif-list">
      <div
        v-for="n in store.notifications"
        :key="n.id"
        :class="['notif-item', { unread: !n.isRead }]"
        @click="handleClick(n)"
      >
        <div class="notif-icon" :style="{ background: iconBg(n.type) }">
          <el-icon size="18" color="#fff">
            <component :is="iconName(n.type)" />
          </el-icon>
        </div>
        <div class="notif-body">
          <div class="notif-title">{{ n.title }}</div>
          <div class="notif-content">{{ n.content }}</div>
          <div class="notif-time">{{ formatDate(n.createdAt) }}</div>
        </div>
        <div v-if="!n.isRead" class="unread-dot" />
      </div>
    </div>

    <div v-if="!loading && store.notifications.length === 0" class="empty-wrap">
      <el-empty description="暂无通知" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useNotificationStore } from '@/stores/notification'
import type { Notification } from '@/types'

const store = useNotificationStore()
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  await store.fetchNotifications()
  loading.value = false
})

function handleClick(n: Notification) {
  if (!n.isRead) store.markRead(n.id)
}

function iconName(type: string) {
  const map: Record<string, string> = {
    system: 'Setting',
    application: 'Document',
    interview: 'Calendar',
    result: 'Trophy',
    announcement: 'Bell',
  }
  return map[type] ?? 'Bell'
}

function iconBg(type: string) {
  const map: Record<string, string> = {
    system: '#909399',
    application: '#409eff',
    interview: '#e6a23c',
    result: '#67c23a',
    announcement: '#f56c6c',
  }
  return map[type] ?? '#409eff'
}

function formatDate(d: string) {
  return new Date(d).toLocaleString('zh-CN', {
    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  })
}
</script>

<style scoped>
.notif-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.notif-header h2 { margin: 0; font-size: 22px; font-weight: 700; }
.notif-list { display: flex; flex-direction: column; gap: 1px; background: #e4e7ed; border-radius: 12px; overflow: hidden; }
.notif-item {
  background: #fff;
  padding: 16px 20px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  cursor: pointer;
  transition: background 0.15s;
  position: relative;
}
.notif-item:hover { background: #f8f9fa; }
.notif-item.unread { background: #f0f7ff; }
.notif-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.notif-body { flex: 1; }
.notif-title { font-size: 14px; font-weight: 600; color: #303133; margin-bottom: 4px; }
.notif-content { font-size: 13px; color: #606266; line-height: 1.5; margin-bottom: 6px; }
.notif-time { font-size: 12px; color: #c0c4cc; }
.unread-dot {
  width: 8px;
  height: 8px;
  background: #409eff;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 8px;
}
.empty-wrap { background: #fff; border-radius: 12px; padding: 60px; }
</style>
