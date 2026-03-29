import { defineStore } from 'pinia'
import { ref } from 'vue'
import { notificationsApi } from '@/api/notifications'
import type { Notification } from '@/types'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  const unreadCount = ref(0)

  async function fetchNotifications() {
    notifications.value = await notificationsApi.getAll()
  }

  async function fetchUnreadCount() {
    const res = await notificationsApi.getUnreadCount()
    unreadCount.value = res.count
  }

  async function markRead(id: number) {
    await notificationsApi.markRead(id)
    const n = notifications.value.find((n) => n.id === id)
    if (n) {
      n.isRead = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  }

  async function markAllRead() {
    await notificationsApi.markAllRead()
    notifications.value.forEach((n) => (n.isRead = true))
    unreadCount.value = 0
  }

  return { notifications, unreadCount, fetchNotifications, fetchUnreadCount, markRead, markAllRead }
})
