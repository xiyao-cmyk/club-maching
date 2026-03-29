import http from './index'

export const clubsApi = {
  getAll: (params?: { categoryId?: number; keyword?: string; page?: number; pageSize?: number }) =>
    http.get<any, any>('/clubs', { params }),

  getCategories: () => http.get<any, any>('/clubs/categories'),

  getOne: (id: number) => http.get<any, any>(`/clubs/${id}`),

  getMyClub: () => http.get<any, any>('/clubs/my'),

  create: (data: any) => http.post<any, any>('/clubs', data),

  update: (id: number, data: any) => http.put<any, any>(`/clubs/${id}`, data),

  saveTags: (id: number, tags: Array<{ tag: string; tagType: string }>) =>
    http.put<any, any>(`/clubs/${id}/tags`, { tags }),

  getRecruitmentConfig: (id: number, batchId?: number) =>
    http.get<any, any>(`/clubs/${id}/recruitment`, { params: { batchId } }),

  upsertRecruitmentConfig: (id: number, data: any) =>
    http.put<any, any>(`/clubs/${id}/recruitment`, data),

  recordBehavior: (id: number, eventType: string, durationMs?: number) =>
    http.post<any, any>(`/clubs/${id}/behavior`, { eventType, durationMs }),
}
