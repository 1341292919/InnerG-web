<template>
  <section class="chat-panel">
    <template v-if="friend">
      <header class="chat-header">
        <div class="header-main">
          <el-avatar :src="friend.avatar" :size="44">{{ friend.username.slice(0, 1) }}</el-avatar>
          <div>
            <h2>{{ friend.username }}</h2>
            <p>{{ friend.online ? '在线，适合聊两句' : '离线，消息会为你保存' }}</p>
          </div>
        </div>
        <div class="connection-badge" :class="connectionStatus">
          <span></span>
          {{ statusText }}
        </div>
      </header>

      <nav class="chat-tabs" aria-label="已打开的聊天窗口">
        <button
          v-for="item in windows"
          :key="item.friend_id"
          class="chat-tab"
          :class="{ active: item.friend_id === activeFriendId }"
          type="button"
          @click="$emit('select-window', item)"
        >
          <el-avatar :src="item.avatar" :size="22">{{ item.username.slice(0, 1) }}</el-avatar>
          <span>{{ item.username }}</span>
          <span v-if="item.unread_count" class="tab-dot"></span>
        </button>
      </nav>

      <div class="message-list">
        <MessageBubble v-for="message in messages" :key="message.id" :message="message" />
      </div>

      <footer class="composer">
        <el-input
          v-model="draft"
          type="textarea"
          :rows="2"
          resize="none"
          maxlength="1000"
          show-word-limit
          placeholder="写点什么给伙伴吧..."
          @keydown.enter.exact.prevent="submit"
        />
        <div class="composer-actions">
          <span>Enter 发送，Shift + Enter 换行</span>
          <el-button type="primary" round :disabled="!draft.trim()" @click="submit">发送</el-button>
        </div>
      </footer>
    </template>

    <div v-else class="empty-chat">
      <div class="empty-orb">G</div>
      <h2>选择一位伙伴</h2>
      <p>打开一个聊天窗口，让对话自然开始。</p>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import MessageBubble from './MessageBubble.vue'

const props = defineProps({
  friend: {
    type: Object,
    default: null,
  },
  messages: {
    type: Array,
    default: () => [],
  },
  windows: {
    type: Array,
    default: () => [],
  },
  activeFriendId: {
    type: Number,
    default: null,
  },
  connectionStatus: {
    type: String,
    default: 'connected',
  },
})

const emit = defineEmits(['send', 'select-window'])

const draft = ref('')

const statusText = computed(() => {
  const map = {
    connected: '在线',
    connecting: '连接中',
    reconnecting: '正在重连',
    disconnected: '已断开',
  }
  return map[props.connectionStatus] || '未知状态'
})

watch(
  () => props.activeFriendId,
  () => {
    draft.value = ''
  },
)

const submit = () => {
  const content = draft.value.trim()
  if (!content) return
  emit('send', content)
  draft.value = ''
}
</script>

<style scoped lang="scss">
.chat-panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.72);
  box-shadow: 0 24px 70px rgba(47, 94, 84, 0.13);
  overflow: hidden;
  backdrop-filter: blur(20px);
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px 14px;
}

.header-main {
  display: flex;
  align-items: center;
  gap: 12px;

  h2 {
    margin: 0;
    color: #243c38;
    font-size: 20px;
  }

  p {
    margin: 4px 0 0;
    color: #7f918d;
    font-size: 13px;
  }
}

.connection-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  border-radius: 999px;
  color: #5f7772;
  background: rgba(241, 247, 245, 0.9);
  font-size: 13px;

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #67c23a;
  }

  &.connecting span,
  &.reconnecting span {
    background: #e6a23c;
  }

  &.disconnected span {
    background: #b8c2bf;
  }
}

.chat-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 0 24px 14px;
  border-bottom: 1px solid rgba(74, 156, 140, 0.1);
}

.chat-tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 7px;
  padding: 8px 12px;
  border: 1px solid rgba(74, 156, 140, 0.12);
  border-radius: 999px;
  color: #58716b;
  background: rgba(255, 255, 255, 0.64);
  cursor: pointer;
  font: inherit;

  &.active {
    color: #2f6359;
    background: rgba(74, 156, 140, 0.14);
    border-color: rgba(74, 156, 140, 0.28);
  }
}

.tab-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #f39f5f;
}

.message-list {
  flex: 1;
  min-height: 0;
  padding: 24px;
  overflow-y: auto;
  background:
    radial-gradient(circle at 12% 8%, rgba(255, 225, 172, 0.22), transparent 28%),
    linear-gradient(180deg, rgba(246, 252, 250, 0.62), rgba(255, 255, 255, 0.28));
}

.composer {
  padding: 16px 20px 18px;
  border-top: 1px solid rgba(74, 156, 140, 0.1);
  background: rgba(255, 255, 255, 0.72);
}

.composer-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
  color: #9aa8a5;
  font-size: 12px;
}

.empty-chat {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  text-align: center;
  color: #748783;

  h2 {
    margin: 18px 0 8px;
    color: #294640;
  }

  p {
    margin: 0;
  }
}

.empty-orb {
  display: grid;
  place-items: center;
  width: 86px;
  height: 86px;
  border-radius: 30px;
  color: #fff;
  background: linear-gradient(135deg, #4a9c8c, #f0b86d);
  box-shadow: 0 20px 40px rgba(74, 156, 140, 0.22);
  font-size: 34px;
  font-weight: 800;
}
</style>
