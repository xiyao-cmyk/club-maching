import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Auth
    { path: '/login', component: () => import('@/views/Auth/Login.vue'), meta: { public: true } },
    { path: '/register', component: () => import('@/views/Auth/Register.vue'), meta: { public: true } },

    // Student
    {
      path: '/',
      component: () => import('@/components/layout/StudentLayout.vue'),
      meta: { role: 'student' },
      children: [
        { path: '', redirect: '/home' },
        { path: 'home', component: () => import('@/views/student/Home.vue') },
        { path: 'clubs', component: () => import('@/views/student/ClubSquare.vue') },
        { path: 'clubs/:id', component: () => import('@/views/student/ClubDetail.vue') },
        { path: 'questionnaire', component: () => import('@/views/student/Questionnaire.vue') },
        { path: 'my-applications', component: () => import('@/views/student/MyApplications.vue') },
        { path: 'notifications', component: () => import('@/views/student/Notifications.vue') },
      ],
    },

    // Club admin
    {
      path: '/club',
      component: () => import('@/components/layout/ClubLayout.vue'),
      meta: { role: 'club_admin' },
      children: [
        { path: '', redirect: '/club/dashboard' },
        { path: 'dashboard', component: () => import('@/views/club/Dashboard.vue') },
        { path: 'profile', component: () => import('@/views/club/ClubProfile.vue') },
        { path: 'recruitment', component: () => import('@/views/club/Recruitment.vue') },
        { path: 'applicants', component: () => import('@/views/club/Applicants.vue') },
        { path: 'interviews', component: () => import('@/views/club/Interviews.vue') },
      ],
    },

    // Admin
    {
      path: '/admin',
      component: () => import('@/components/layout/AdminLayout.vue'),
      meta: { role: 'admin' },
      children: [
        { path: '', redirect: '/admin/dashboard' },
        { path: 'dashboard', component: () => import('@/views/admin/Dashboard.vue') },
        { path: 'clubs', component: () => import('@/views/admin/Clubs.vue') },
        { path: 'users', component: () => import('@/views/admin/Users.vue') },
        { path: 'batches', component: () => import('@/views/admin/Batches.vue') },
        { path: 'announcements', component: () => import('@/views/admin/Announcements.vue') },
        { path: 'statistics', component: () => import('@/views/admin/Statistics.vue') },
      ],
    },

    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  auth.init()

  if (to.meta.public) {
    if (auth.isLoggedIn) {
      return next(getRoleHome(auth.user?.role))
    }
    return next()
  }

  if (!auth.isLoggedIn) {
    return next('/login')
  }

  if (to.meta.role && auth.user?.role !== to.meta.role) {
    return next(getRoleHome(auth.user?.role))
  }

  next()
})

function getRoleHome(role?: string) {
  if (role === 'admin') return '/admin/dashboard'
  if (role === 'club_admin') return '/club/dashboard'
  return '/home'
}

export default router
