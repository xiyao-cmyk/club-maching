<template>
  <router-view />
</template>

<script setup lang="ts">
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', sans-serif;
  background: #f5f7fa;
  color: #303133;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.card-shadow {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
</style>
