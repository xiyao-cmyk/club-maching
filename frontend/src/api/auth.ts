import http from './index'

export const authApi = {
  login: (data: { email: string; password: string }) =>
    http.post<any, any>('/auth/login', data),

  register: (data: { email: string; password: string; name: string; role?: string }) =>
    http.post<any, any>('/auth/register', data),

  me: () => http.get<any, any>('/auth/me'),
}
