<template>
  <el-container class="app-layout">
    <el-aside width="220px" class="aside">
      <div class="sidebar-logo">
        <el-icon size="22" color="#67c23a"><Shield /></el-icon>
        <span>校方管理后台</span>
      </div>

      <el-menu :default-active="route.path" router class="sidebar-menu">
        <el-menu-item index="/admin/dashboard">
          <el-icon><DataAnalysis /></el-icon>总览
        </el-menu-item>
        <el-menu-item index="/admin/clubs">
          <el-icon><OfficeBuilding /></el-icon>社团管理
        </el-menu-item>
        <el-menu-item index="/admin/users">
          <el-icon><UserFilled /></el-icon>用户管理
        </el-menu-item>
        <el-menu-item index="/admin/batches">
          <el-icon><Calendar /></el-icon>招新批次
        </el-menu-item>
        <el-menu-item index="/admin/announcements">
          <el-icon><Notification /></el-icon>公告管理
        </el-menu-item>
        <el-menu-item index="/admin/statistics">
          <el-icon><TrendCharts /></el-icon>统计报表
        </el-menu-item>
      </el-menu>

      <div class="sidebar-footer">
        <el-dropdown @command="handleCommand">
          <div class="user-info">
            <el-avatar :size="32" style="background: #67c23a">
              {{ auth.user?.name?.charAt(0) }}
            </el-avatar>
            <div>
              <div class="user-name">{{ auth.user?.name }}</div>
              <div class="user-role">系统管理员</div>
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
.app-layout { min-height: 100vh; }
.aside {
  background: #1a2744;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
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
  background: rgba(103, 194, 58, 0.15);
  color: #67c23a;
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
.user-name { font-size: 14px; color: #fff; font-weight: 500; }
.user-role { font-size: 12px; color: rgba(255, 255, 255, 0.5); }
.main-content {
  margin-left: 220px;
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}
</style>
