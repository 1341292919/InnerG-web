<template>
  <div class="message-row" :class="message.direction">
    <el-avatar v-if="message.direction === 'incoming'" :src="message.avatar" :size="34" class="message-avatar">
      {{ fallbackName }}
    </el-avatar>
    <div class="message-main">
      <div class="message-bubble">
        {{ message.content }}
      </div>
      <div class="message-meta">
        <span>{{ formatChatTime(message.createdAt) }}</span>
        <span v-if="message.direction === 'outgoing'" class="message-status">{{ statusText }}</span>
      </div>
    </div>
    <el-avatar v-if="message.direction === 'outgoing'" :src="message.avatar" :size="34" class="message-avatar">
      我
    </el-avatar>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
})

const fallbackName = computed(() => props.message.senderName?.slice(0, 1) || '友')

const statusText = computed(() => {
  if (props.message.status === 'sending') return '发送中'
  if (props.message.status === 'failed') return '发送失败'
  return '已发送'
})

const formatChatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp * 1000)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
</script>

<style scoped lang="scss">
.message-row {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;

  &.outgoing {
    justify-content: flex-end;

    .message-main {
      align-items: flex-end;
    }

    .message-bubble {
      color: #fff;
      background: linear-gradient(135deg, #4a9c8c 0%, #3a7d6f 100%);
      border-bottom-right-radius: 6px;
      box-shadow: 0 10px 22px rgba(74, 156, 140, 0.18);
    }
  }

  &.incoming {
    justify-content: flex-start;

    .message-bubble {
      color: #31423f;
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid rgba(74, 156, 140, 0.1);
      border-bottom-left-radius: 6px;
      box-shadow: 0 10px 24px rgba(39, 73, 66, 0.06);
    }
  }
}

.message-avatar {
  flex: 0 0 auto;
  margin-top: 4px;
  background: #d8eee9;
  color: #3a7d6f;
}

.message-main {
  display: flex;
  flex-direction: column;
  max-width: min(68%, 620px);
}

.message-bubble {
  padding: 12px 15px;
  border-radius: 18px;
  line-height: 1.7;
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-word;
}

.message-meta {
  display: flex;
  gap: 8px;
  margin-top: 6px;
  color: #9aa8a5;
  font-size: 12px;
}

.message-status {
  color: #79a69d;
}
</style>
