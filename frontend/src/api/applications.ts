import http from './index'

export const applicationsApi = {
  apply: (data: { clubId: number; batchId: number; motivation?: string; customAnswers?: any }) =>
    http.post<any, any>('/applications', data),

  getMyApplications: () => http.get<any, any>('/applications/my'),

  getActiveBatch: () => http.get<any, any>('/applications/active-batch'),

  withdraw: (id: number) => http.put<any, any>(`/applications/${id}/withdraw`, {}),

  getClubApplications: (clubId: number, batchId?: number) =>
    http.get<any, any>(`/applications/club/${clubId}`, { params: { batchId } }),

  updateStatus: (id: number, data: { status: string; score?: number; remark?: string }) =>
    http.put<any, any>(`/applications/${id}/status`, data),

  scheduleInterview: (id: number, data: any) =>
    http.post<any, any>(`/applications/${id}/interview`, data),
}
