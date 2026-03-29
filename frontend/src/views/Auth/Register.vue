<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo">
        <el-icon size="40" color="#409EFF"><Compass /></el-icon>
        <h1>创建账号</h1>
        <p>加入社团招新智能匹配平台</p>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" size="large" @submit.prevent="handleRegister">
        <el-form-item prop="name">
          <el-input v-model="form.name" placeholder="姓名" prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="邮箱" prefix-icon="Message" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码（至少6位）" prefix-icon="Lock" show-password />
        </el-form-item>
        <el-form-item prop="role">
          <el-radio-group v-model="form.role">
            <el-radio value="student">我是新生</el-radio>
            <el-radio value="club_admin">我是社团负责人</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-button type="primary" native-type="submit" :loading="loading" style="width: 100%">
          注册
        </el-button>
      </el-form>

      <div class="auth-footer">
        已有账号？
        <el-link type="primary" @click="router.push('/login')">立即登录</el-link>
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

const form = reactive({ name: '', email: '', password: '', role: 'student' })

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [{ required: true, type: 'email', message: '请输入有效邮箱', trigger: 'blur' }],
  password: [{ required: true, min: 6, message: '密码至少6位', trigger: 'blur' }],
}

async function handleRegister() {
  await formRef.value?.validate()
  loading.value = true
  try {
    const res = await auth.register(form)
    ElMessage.success('注册成功，欢迎加入！')
    const role = res.user.role
    if (role === 'club_admin') router.push('/club/dashboard')
    else router.push('/questionnaire')
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
.auth-logo h1 { font-size: 20px; font-weight: 700; color: #303133; margin: 12px 0 8px; }
.auth-logo p { font-size: 14px; color: #909399; margin: 0; }
.auth-footer { text-align: center; margin-top: 20px; font-size: 14px; color: #606266; }
</style>
