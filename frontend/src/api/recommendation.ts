import http from './index'

export const recommendationApi = {
  getRecommendations: (limit = 8) =>
    http.get<any, any>('/recommendation', { params: { limit } }),

  getAnnouncements: () => http.get<any, any>('/recommendation/announcements'),

  getStats: () => http.get<any, any>('/recommendation/stats'),
}
