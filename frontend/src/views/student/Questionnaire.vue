<template>
  <div class="page-container">
    <div class="questionnaire-wrapper">
      <div class="q-header">
        <el-icon size="36" color="#409EFF"><Finished /></el-icon>
        <h2>兴趣问卷</h2>
        <p>帮助我们了解你，找到最适合的社团</p>
      </div>

      <el-progress
        :percentage="Math.round((currentStep / sections.length) * 100)"
        :format="() => `${currentStep} / ${sections.length}`"
        style="margin-bottom: 32px"
      />

      <div v-if="!submitted" v-loading="loading">
        <div v-for="(section, si) in sections" :key="section.key" v-show="currentStep === si + 1">
          <div class="section-title">
            <el-tag type="primary" size="large">{{ si + 1 }}/{{ sections.length }}</el-tag>
            <span>{{ section.label }}</span>
          </div>

          <div v-for="q in section.questions" :key="q.id" class="question-card">
            <div class="question-text">{{ q.question }}</div>

            <el-radio-group
              v-if="q.type === 'single'"
              v-model="answers[q.id]"
              class="options-group"
            >
              <el-radio
                v-for="opt in q.options"
                :key="opt.value"
                :value="opt.value"
                class="option-radio"
              >{{ opt.label }}</el-radio>
            </el-radio-group>

            <div v-else-if="q.type === 'multi'" class="options-group">
              <el-checkbox-group v-model="multiAnswers[q.id]">
                <el-checkbox
                  v-for="opt in q.options"
                  :key="opt.value"
                  :value="opt.value"
                  class="option-checkbox"
                >{{ opt.label }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>

          <div class="nav-buttons">
            <el-button v-if="si > 0" @click="currentStep--" size="large">上一步</el-button>
            <el-button
              v-if="si < sections.length - 1"
              type="primary"
              @click="nextStep(si)"
              size="large"
            >下一步</el-button>
            <el-button
              v-else
              type="primary"
              @click="submitQuestionnaire"
              :loading="submitting"
              size="large"
            >提交问卷，查看推荐</el-button>
          </div>
        </div>
      </div>

      <div v-else class="submitted-result">
        <el-result icon="success" title="问卷完成！" sub-title="已根据你的兴趣生成专属推荐">
          <template #extra>
            <el-button type="primary" size="large" @click="router.push('/home')">查看推荐社团</el-button>
          </template>
        </el-result>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { questionnaireApi } from '@/api/questionnaire'
import type { QuestionnaireQuestion } from '@/types'

const router = useRouter()
const loading = ref(false)
const submitting = ref(false)
const submitted = ref(false)
const currentStep = ref(1)

const allQuestions = ref<QuestionnaireQuestion[]>([])
const answers = reactive<Record<number, string>>({})
const multiAnswers = reactive<Record<number, string[]>>({})

const sectionOrder = ['interest', 'time', 'skill', 'personality', 'goal']
const sectionLabels: Record<string, string> = {
  interest: '兴趣方向',
  time: '时间投入',
  skill: '技能特长',
  personality: '性格偏好',
  goal: '参与目标',
}

const sections = computed(() => {
  return sectionOrder
    .map((key) => ({
      key,
      label: sectionLabels[key],
      questions: allQuestions.value.filter((q) => q.section === key),
    }))
    .filter((s) => s.questions.length > 0)
})

onMounted(async () => {
  loading.value = true
  try {
    allQuestions.value = await questionnaireApi.getQuestions()

    // 初始化多选答案数组
    allQuestions.value.filter(q => q.type === 'multi').forEach(q => {
      multiAnswers[q.id] = []
    })

    // 加载已有答案
    try {
      const existing = await questionnaireApi.getMyAnswers()
      if (existing?.completed) {
        submitted.value = true
      } else if (existing?.answers) {
        Object.entries(existing.answers).forEach(([qId, val]) => {
          const q = allQuestions.value.find(q => q.id === +qId)
          if (q?.type === 'multi' && Array.isArray(val)) {
            multiAnswers[+qId] = val as string[]
          } else {
            answers[+qId] = val as string
          }
        })
      }
    } catch { /* 无已有答案 */ }
  } finally {
    loading.value = false
  }
})

function nextStep(si: number) {
  const section = sections.value[si]
  for (const q of section.questions) {
    if (q.type === 'single' && !answers[q.id]) {
      ElMessage.warning('请回答所有题目')
      return
    }
    if (q.type === 'multi' && (!multiAnswers[q.id] || multiAnswers[q.id].length === 0)) {
      ElMessage.warning('请至少选择一项')
      return
    }
  }
  currentStep.value++
}

async function submitQuestionnaire() {
  const combined: Record<number, any> = { ...answers }
  Object.entries(multiAnswers).forEach(([k, v]) => {
    combined[+k] = v
  })
  submitting.value = true
  try {
    await questionnaireApi.saveAnswers(combined, true)
    submitted.value = true
    ElMessage.success('问卷提交成功！')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.questionnaire-wrapper {
  max-width: 720px;
  margin: 0 auto;
  background: #fff;
  border-radius: 16px;
  padding: 48px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.q-header {
  text-align: center;
  margin-bottom: 32px;
}

.q-header h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 12px 0 8px;
}

.q-header p {
  color: #909399;
  margin: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #303133;
}

.question-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
}

.question-text {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.options-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-radio, .option-checkbox {
  height: auto !important;
  line-height: 1.5;
  font-size: 14px;
  padding: 10px 16px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  transition: all 0.2s;
  width: 100%;
}

.option-radio:hover, .option-checkbox:hover {
  border-color: #409eff;
  background: #ecf5ff;
}

.nav-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
}

.submitted-result {
  padding: 40px 0;
}
</style>
