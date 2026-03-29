<template>
  <div class="page-container">
    <div class="square-header">
      <h2>社团广场</h2>
      <p>{{ total }} 个活跃社团等你探索</p>
    </div>

    <!-- 搜索和筛选 -->
    <div class="filter-bar">
      <el-input
        v-model="keyword"
        placeholder="搜索社团名称..."
        prefix-icon="Search"
        clearable
        style="width: 280px"
        @input="onSearch"
      />
      <div class="category-tabs">
        <el-button
          :type="selectedCategory === undefined ? 'primary' : 'default'"
          round
          @click="selectCategory(undefined)"
        >全部</el-button>
        <el-button
          v-for="cat in categories"
          :key="cat.id"
          :type="selectedCategory === cat.id ? 'primary' : 'default'"
          round
          @click="selectCategory(cat.id)"
        >{{ cat.name }}</el-button>
      </div>
    </div>

    <!-- 社团列表 -->
    <div v-loading="loading" class="clubs-grid">
      <ClubCard
        v-for="club in clubs"
        :key="club.id"
        :club="club"
        @click="router.push(`/clubs/${club.id}`)"
      />
    </div>

    <div v-if="!loading && clubs.length === 0" class="empty-state">
      <el-empty description="暂无符合条件的社团" />
    </div>

    <div class="pagination-wrap">
      <el-pagination
        v-if="total > pageSize"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        v-model:current-page="page"
        @current-change="fetchClubs"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { clubsApi } from '@/api/clubs'
import ClubCard from '@/components/ClubCard.vue'
import type { Club, ClubCategory } from '@/types'

const router = useRouter()
const loading = ref(false)
const clubs = ref<Club[]>([])
const categories = ref<ClubCategory[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = 12
const keyword = ref('')
const selectedCategory = ref<number | undefined>(undefined)

let searchTimer: ReturnType<typeof setTimeout>

onMounted(async () => {
  categories.value = await clubsApi.getCategories()
  fetchClubs()
})

async function fetchClubs() {
  loading.value = true
  try {
    const res = await clubsApi.getAll({
      page: page.value,
      pageSize,
      keyword: keyword.value || undefined,
      categoryId: selectedCategory.value,
    })
    clubs.value = res.items
    total.value = res.total
  } finally {
    loading.value = false
  }
}

function selectCategory(id?: number) {
  selectedCategory.value = id
  page.value = 1
  fetchClubs()
}

function onSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    page.value = 1
    fetchClubs()
  }, 400)
}
</script>

<style scoped>
.square-header {
  margin-bottom: 24px;
}
.square-header h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 4px;
}
.square-header p {
  color: #909399;
  margin: 0;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 24px;
  background: #fff;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.category-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.clubs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  min-height: 200px;
}

.empty-state, .pagination-wrap {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}
</style>
