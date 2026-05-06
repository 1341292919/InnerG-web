<template>
  <div class="loading-spinner">
    <el-icon class="loading-icon" :size="iconSize" :style="{ color: color }">
      <Loading />
    </el-icon>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup>
import { Loading } from '@element-plus/icons-vue'

defineProps({
  text: {
    type: String,
    default: '加载中...',
  },
  iconSize: {
    type: Number,
    default: 32,
  },
  color: {
    type: String,
    default: '#409eff',
  },
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}
.loading-icon {
  animation: rotating 1.5s linear infinite;
}
.loading-text {
  margin-top: 12px;
  font-size: 14px;
  color: #909399;
}
@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
