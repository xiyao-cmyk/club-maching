import http from './index'

export const favoritesApi = {
  getAll: () => http.get<any, any>('/favorites'),
  add: (clubId: number) => http.post<any, any>(`/favorites/${clubId}`, {}),
  remove: (clubId: number) => http.delete<any, any>(`/favorites/${clubId}`),
  check: (clubId: number) => http.get<any, any>(`/favorites/check/${clubId}`),
}
