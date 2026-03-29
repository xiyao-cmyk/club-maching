<template>
  <el-container class="app-layout">
    <el-header class="app-header">
      <div class="header-inner">
        <div class="logo" @click="router.push('/home')">
          <el-icon size="24" color="#409EFF"><Compass /></el-icon>
          <span>社团招新平台</span>
        </div>

        <el-menu
          mode="horizontal"
          :default-active="activeMenu"
          router
          :ellipsis="false"
          class="nav-menu"
        >
          <el-menu-item index="/home">
            <el-icon><House /></el-icon>首页推荐
          </el-menu-item>
          <el-menu-item index="/clubs">
            <el-icon><Grid /></el-icon>社团广场
          </el-menu-item>
          <el-menu-item index="/questionnaire">
            <el-icon><Finished /></el-icon>兴趣问卷
          </el-menu-item>
          <el-menu-item index="/my-applications">
            <el-icon><Document /></el-icon>我的报名
          </el-menu-item>
        </el-menu>

        <div class="header-right">
          <el-badge :value="unreadCount || undefined" :hidden="!unreadCount">
            <el-button circle @click="router.push('/notifications')">
              <el-icon><Bell /></el-icon>
            </el-button>
          </el-badge>

          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" :src="auth.user?.avatar">
                {{ auth.user?.name?.charAt(0) }}
              </el-avatar>
              <span class="user-name">{{ auth.user?.name }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <el-main class="app-main">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const notifStore = useNotificationStore()

const activeMenu = computed(() => '/' + route.path.split('/')[1])
const unreadCount = computed(() => notifStore.unreadCount)

onMounted(() => {
  notifStore.fetchUnreadCount()
})

function handleCommand(cmd: string) {
  if (cmd === 'logout') {
    auth.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
}

.app-header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  height: 60px;
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #303133;
  cursor: pointer;
  white-space: nowrap;
}

.nav-menu {
  flex: 1;
  border-bottom: none;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.user-name {
  font-size: 14px;
  color: #606266;
}

.app-main {
  background: #f5f7fa;
  padding: 24px 20px;
  min-height: calc(100vh - 60px);
}
</style>
