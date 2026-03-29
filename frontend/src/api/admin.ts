import http from './index'

export const adminApi = {
  getDashboard: () => http.get<any, any>('/admin/dashboard'),
  getAllClubs: (status?: string) => http.get<any, any>('/admin/clubs', { params: { status } }),
  approveClub: (id: number) => http.put<any, any>(`/admin/clubs/${id}/approve`, {}),
  rejectClub: (id: number) => http.put<any, any>(`/admin/clubs/${id}/reject`, {}),
  getUsers: (role?: string, page = 1, pageSize = 20) =>
    http.get<any, any>('/admin/users', { params: { role, page, pageSize } }),
  getBatches: () => http.get<any, any>('/admin/batches'),
  createBatch: (data: any) => http.post<any, any>('/admin/batches', data),
  updateBatch: (id: number, data: any) => http.put<any, any>(`/admin/batches/${id}`, data),
  getAnnouncements: () => http.get<any, any>('/admin/announcements'),
  createAnnouncement: (data: any) => http.post<any, any>('/admin/announcements', data),
  updateAnnouncement: (id: number, data: any) => http.put<any, any>(`/admin/announcements/${id}`, data),
  getApplicationStats: (batchId?: number) =>
    http.get<any, any>('/admin/stats/applications', { params: { batchId } }),
}
