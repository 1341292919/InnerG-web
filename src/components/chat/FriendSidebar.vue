<template>
  <aside class="friend-sidebar">
    <section class="sidebar-hero">
      <p class="eyebrow">伙伴聊天</p>
      <h2>和重要的人保持连接</h2>
      <p>把轻松的问候、真实的情绪和温暖的陪伴留在这里。</p>
    </section>

    <el-input v-model="keyword" class="friend-search" placeholder="搜索伙伴" clearable>
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>

    <button class="request-entry" type="button" @click="$emit('request-click')">
      <span>
        <strong>好友申请</strong>
        <small>{{ requestCount ? `${requestCount} 条待处理` : '暂无新的申请' }}</small>
      </span>
      <span v-if="requestCount" class="request-badge">{{ requestCount }}</span>
    </button>

    <section class="friend-section">
      <div class="section-title">最近聊天</div>
      <div class="friend-list">
        <button
          v-for="friend in filteredFriends"
          :key="friend.friend_id"
          class="friend-item"
          :class="{ active: friend.friend_id === activeFriendId }"
          type="button"
          @click="$emit('select', friend)"
        >
          <div class="avatar-wrap">
            <el-avatar :src="friend.avatar" :size="42">{{ friend.username.slice(0, 1) }}</el-avatar>
            <span v-if="friend.online" class="online-dot"></span>
          </div>
          <div class="friend-main">
            <div class="friend-line">
              <strong>{{ friend.username }}</strong>
              <time>{{ friend.updated_at }}</time>
            </div>
            <div class="friend-preview">{{ friend.last_message }}</div>
          </div>
          <span v-if="friend.unread_count" class="unread-badge">{{ friend.unread_count }}</span>
        </button>
      </div>
    </section>
  </aside>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'

const props = defineProps({
  friends: {
    type: Array,
    default: () => [],
  },
  activeFriendId: {
    type: Number,
    default: null,
  },
  requestCount: {
    type: Number,
    default: 0,
  },
})

defineEmits(['select', 'request-click'])

const keyword = ref('')

const filteredFriends = computed(() => {
  const value = keyword.value.trim().toLowerCase()
  if (!value) return props.friends
  return props.friends.filter((friend) => friend.username.toLowerCase().includes(value))
})
</script>

<style scoped lang="scss">
.friend-sidebar {
  min-width: 0;
  height: 100%;
  padding: 20px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 24px 60px rgba(47, 94, 84, 0.12);
  backdrop-filter: blur(18px);
  overflow: hidden;
}

.sidebar-hero {
  padding: 4px 4px 18px;

  .eyebrow {
    margin: 0 0 8px;
    color: #4a9c8c;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
  }

  h2 {
    margin: 0;
    color: #243c38;
    font-size: 24px;
    line-height: 1.25;
  }

  p:last-child {
    margin: 10px 0 0;
    color: #748783;
    font-size: 13px;
    line-height: 1.7;
  }
}

.friend-search {
  margin-bottom: 14px;
}

.request-entry,
.friend-item {
  width: 100%;
  border: 0;
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.request-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  padding: 14px 15px;
  border-radius: 18px;
  color: #2f5650;
  background: linear-gradient(135deg, rgba(255, 242, 209, 0.95), rgba(230, 248, 243, 0.95));

  strong,
  small {
    display: block;
  }

  small {
    margin-top: 4px;
    color: #7f8f8a;
    font-size: 12px;
  }
}

.request-badge,
.unread-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  border-radius: 999px;
  color: #fff;
  background: #f39f5f;
  font-size: 12px;
  font-weight: 700;
}

.section-title {
  margin: 0 0 10px 4px;
  color: #8b9b97;
  font-size: 13px;
  font-weight: 700;
}

.friend-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: calc(100vh - 360px);
  overflow: auto;
  padding-right: 2px;
}

.friend-item {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 18px;
  color: #38514c;
  background: transparent;
  transition:
    background 0.2s ease,
    transform 0.2s ease;

  &:hover,
  &.active {
    background: rgba(74, 156, 140, 0.1);
  }

  &.active {
    transform: translateX(2px);
  }
}

.avatar-wrap {
  position: relative;
}

.online-dot {
  position: absolute;
  right: 0;
  bottom: 1px;
  width: 10px;
  height: 10px;
  border: 2px solid #fff;
  border-radius: 50%;
  background: #67c23a;
}

.friend-main {
  min-width: 0;
}

.friend-line {
  display: flex;
  justify-content: space-between;
  gap: 10px;

  strong {
    overflow: hidden;
    color: #294640;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  time {
    flex: 0 0 auto;
    color: #a6b3b0;
    font-size: 12px;
  }
}

.friend-preview {
  overflow: hidden;
  margin-top: 5px;
  color: #879692;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
