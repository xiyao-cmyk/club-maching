<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo">
        <el-icon size="40" color="#409EFF"><Compass /></el-icon>
        <h1>社团招新智能匹配平台</h1>
        <p>发现适合你的社团，开启精彩大学生活</p>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" size="large" @submit.prevent="handleLogin">
        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="邮箱" prefix-icon="Message" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码" prefix-icon="Lock" show-password />
        </el-form-item>

        <el-button type="primary" native-type="submit" :loading="loading" style="width: 100%">
          登录
        </el-button>
      </el-form>

      <div class="auth-footer">
        还没有账号？
        <el-link type="primary" @click="router.push('/register')">立即注册</el-link>
      </div>

      <el-divider>测试账号</el-divider>
      <div class="demo-accounts">
        <el-button size="small" @click="fillDemo('student@test.com')">新生账号</el-button>
        <el-button size="small" @click="fillDemo('club@test.com')">社团管理员</el-button>
        <el-button size="small" @click="fillDemo('admin@test.com')">系统管理员</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const formRef = ref()
const loading = ref(false)

const form = reactive({ email: '', password: '' })

const rules = {
  email: [{ required: true, type: 'email', message: '请输入有效邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

function fillDemo(email: string) {
  form.email = email
  form.password = 'Admin123!'
}

async function handleLogin() {
  await formRef.value?.validate()
  loading.value = true
  try {
    const res = await auth.login(form.email, form.password)
    ElMessage.success('登录成功')
    const role = res.user.role
    if (role === 'admin') router.push('/admin/dashboard')
    else if (role === 'club_admin') router.push('/club/dashboard')
    else router.push('/home')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-card {
  background: #fff;
  border-radius: 16px;
  padding: 48px 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.auth-logo {
  text-align: center;
  margin-bottom: 32px;
}

.auth-logo h1 {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
  margin: 12px 0 8px;
}

.auth-logo p {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.auth-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #606266;
}

.demo-accounts {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
