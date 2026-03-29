import axios from 'axios'
import { ElMessage } from 'element-plus'

// VITE_API_BASE_URL 用于 Vercel 等跨域部署，本地开发时由 vite proxy 透传
const http = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL as string) ?? '/api',
  timeout: 15000,
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message ?? '请求失败，请稍后重试'
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    } else {
      ElMessage.error(Array.isArray(message) ? message[0] : message)
    }
    return Promise.reject(error)
  },
)

export default http
