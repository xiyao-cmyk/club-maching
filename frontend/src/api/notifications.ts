import http from './index'

export const notificationsApi = {
  getAll: () => http.get<any, any>('/notifications'),
  getUnreadCount: () => http.get<any, any>('/notifications/unread-count'),
  markRead: (id: number) => http.put<any, any>(`/notifications/${id}/read`, {}),
  markAllRead: () => http.put<any, any>('/notifications/read-all', {}),
}
