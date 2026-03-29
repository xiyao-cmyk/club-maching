import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isLoggedIn = computed(() => !!token.value)
  const isStudent = computed(() => user.value?.role === 'student')
  const isClubAdmin = computed(() => user.value?.role === 'club_admin')
  const isAdmin = computed(() => user.value?.role === 'admin')

  function init() {
    const storedToken = localStorage.getItem('access_token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
    }
  }

  async function login(email: string, password: string) {
    const res = await authApi.login({ email, password })
    token.value = res.accessToken
    user.value = res.user
    localStorage.setItem('access_token', res.accessToken)
    localStorage.setItem('user', JSON.stringify(res.user))
    return res
  }

  async function register(data: { email: string; password: string; name: string; role?: string }) {
    const res = await authApi.register(data)
    token.value = res.accessToken
    user.value = res.user
    localStorage.setItem('access_token', res.accessToken)
    localStorage.setItem('user', JSON.stringify(res.user))
    return res
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  }

  async function refreshUser() {
    try {
      const u = await authApi.me()
      user.value = u
      localStorage.setItem('user', JSON.stringify(u))
    } catch {
      logout()
    }
  }

  return { user, token, isLoggedIn, isStudent, isClubAdmin, isAdmin, init, login, register, logout, refreshUser }
})
