<template>
  <div class="empty-state">
    <el-icon class="empty-icon" :size="iconSize">
      <component :is="icon" />
    </el-icon>
    <p class="empty-text">{{ text }}</p>
    <slot />
  </div>
</template>

<script setup>
import { FolderDelete } from '@element-plus/icons-vue'

defineProps({
  text: {
    type: String,
    default: '暂无数据',
  },
  icon: {
    type: [String, Object],
    default: FolderDelete,
  },
  iconSize: {
    type: Number,
    default: 48,
  },
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #c0c4cc;
}
.empty-text {
  margin-top: 12px;
  font-size: 14px;
  color: #909399;
}
</style>
