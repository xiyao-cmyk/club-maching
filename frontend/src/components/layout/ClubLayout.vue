<template>
  <el-container class="app-layout">
    <el-aside width="220px" class="aside">
      <div class="sidebar-logo">
        <el-icon size="22" color="#409EFF"><Compass /></el-icon>
        <span>社团管理中心</span>
      </div>

      <el-menu
        :default-active="route.path"
        router
        class="sidebar-menu"
      >
        <el-menu-item index="/club/dashboard">
          <el-icon><DataAnalysis /></el-icon>数据看板
        </el-menu-item>
        <el-menu-item index="/club/profile">
          <el-icon><OfficeBuilding /></el-icon>社团主页
        </el-menu-item>
        <el-menu-item index="/club/recruitment">
          <el-icon><Setting /></el-icon>招新配置
        </el-menu-item>
        <el-menu-item index="/club/applicants">
          <el-icon><User /></el-icon>报名名单
        </el-menu-item>
        <el-menu-item index="/club/interviews">
          <el-icon><Calendar /></el-icon>面试安排
        </el-menu-item>
      </el-menu>

      <div class="sidebar-footer">
        <el-dropdown @command="handleCommand">
          <div class="user-info">
            <el-avatar :size="32">{{ auth.user?.name?.charAt(0) }}</el-avatar>
            <div>
              <div class="user-name">{{ auth.user?.name }}</div>
              <div class="user-role">社团管理员</div>
            </div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-aside>

    <el-container>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

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

.aside {
  background: #1d2b45;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
}

.sidebar-logo {
  height: 64px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-menu {
  flex: 1;
  background: transparent;
  border: none;
  padding: 12px 0;
}

.sidebar-menu :deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.75);
  border-radius: 8px;
  margin: 2px 12px;
}

.sidebar-menu :deep(.el-menu-item.is-active),
.sidebar-menu :deep(.el-menu-item:hover) {
  background: rgba(64, 158, 255, 0.15);
  color: #409eff;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.user-name {
  font-size: 14px;
  color: #fff;
  font-weight: 500;
}

.user-role {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.main-content {
  margin-left: 220px;
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}
</style>
