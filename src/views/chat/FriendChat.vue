<template>
  <main class="friend-chat-page">
    <div class="chat-shell">
      <FriendSidebar
        :friends="friends"
        :active-friend-id="activeFriendId"
        :request-count="friendRequestCount"
        @select="handleSelectFriend"
        @request-click="handleRequestClick"
      />
      <ChatPanel
        :friend="activeFriend"
        :messages="activeMessages"
        :windows="openedWindows"
        :active-friend-id="activeFriendId"
        :connection-status="connectionStatus"
        @send="handleSendMessage"
        @select-window="handleSelectFriend"
      />
    </div>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import ChatPanel from '@/components/chat/ChatPanel.vue'
import FriendSidebar from '@/components/chat/FriendSidebar.vue'

const currentUserId = 1001
const defaultAvatar = new URL('../../assets/brand_icon.svg', import.meta.url).href

const friends = ref([
  {
    friend_id: 1002,
    username: 'Echo',
    avatar: '',
    last_message: '今晚还好吗？我刚刚听完那首歌。',
    unread_count: 2,
    online: true,
    updated_at: '20:48',
  },
  {
    friend_id: 1003,
    username: 'Mira',
    avatar: '',
    last_message: '明天一起去散步吧。',
    unread_count: 0,
    online: false,
    updated_at: '昨天',
  },
  {
    friend_id: 1004,
    username: '林间风',
    avatar: '',
    last_message: '不用急，慢慢来。',
    unread_count: 1,
    online: true,
    updated_at: '周六',
  },
])

const messagesByFriend = ref({
  1002: [
    {
      id: 'm-1002-1',
      fromUser: 1002,
      toUser: currentUserId,
      senderName: 'Echo',
      avatar: '',
      content: '今晚还好吗？我刚刚听完那首歌，感觉心里安静了一点。',
      type: 1,
      status: 'sent',
      createdAt: 1765121100,
      direction: 'incoming',
    },
    {
      id: 'm-1002-2',
      fromUser: currentUserId,
      toUser: 1002,
      senderName: '我',
      avatar: defaultAvatar,
      content: '还不错。今天适合慢一点，我们可以边听边聊。',
      type: 1,
      status: 'sent',
      createdAt: 1765121280,
      direction: 'outgoing',
    },
  ],
  1003: [
    {
      id: 'm-1003-1',
      fromUser: 1003,
      toUser: currentUserId,
      senderName: 'Mira',
      avatar: '',
      content: '明天一起去散步吧，找个有树影的地方。',
      type: 1,
      status: 'sent',
      createdAt: 1765038000,
      direction: 'incoming',
    },
  ],
  1004: [
    {
      id: 'm-1004-1',
      fromUser: 1004,
      toUser: currentUserId,
      senderName: '林间风',
      avatar: '',
      content: '不用急，慢慢来。有些答案本来就需要一点时间。',
      type: 1,
      status: 'sent',
      createdAt: 1764951600,
      direction: 'incoming',
    },
  ],
})

const activeFriendId = ref(friends.value[0].friend_id)
const openedWindowIds = ref([friends.value[0].friend_id, friends.value[1].friend_id])
const connectionStatus = ref('connected')
const friendRequestCount = ref(2)

const activeFriend = computed(() => friends.value.find((friend) => friend.friend_id === activeFriendId.value) || null)

const activeMessages = computed(() => messagesByFriend.value[activeFriendId.value] || [])

const openedWindows = computed(() =>
  openedWindowIds.value.map((id) => friends.value.find((friend) => friend.friend_id === id)).filter(Boolean),
)

const handleSelectFriend = (friend) => {
  activeFriendId.value = friend.friend_id
  if (!openedWindowIds.value.includes(friend.friend_id)) {
    openedWindowIds.value.push(friend.friend_id)
  }
}

const handleSendMessage = (content) => {
  if (!activeFriend.value) return
  const friendId = activeFriend.value.friend_id
  const nextMessage = {
    id: `mock-${Date.now()}`,
    fromUser: currentUserId,
    toUser: friendId,
    senderName: '我',
    avatar: defaultAvatar,
    content,
    type: 1,
    status: 'sent',
    createdAt: Math.floor(Date.now() / 1000),
    direction: 'outgoing',
  }
  messagesByFriend.value[friendId] = [...(messagesByFriend.value[friendId] || []), nextMessage]
}

const handleRequestClick = () => {
  ElMessage.info('好友申请面板将在下一步接入')
}
</script>

<style scoped lang="scss">
.friend-chat-page {
  min-height: calc(100vh - 154px);
  padding: 24px 32px 30px;
  box-sizing: border-box;
  background:
    radial-gradient(circle at 18% 12%, rgba(255, 222, 161, 0.38), transparent 28%),
    radial-gradient(circle at 86% 18%, rgba(137, 213, 196, 0.36), transparent 30%),
    linear-gradient(135deg, #eefbf7 0%, #fff8ef 48%, #f7fbff 100%);
}

.chat-shell {
  display: grid;
  grid-template-columns: minmax(280px, 340px) minmax(0, 1fr);
  gap: 22px;
  max-width: 1280px;
  height: calc(100vh - 214px);
  min-height: 620px;
  margin: 0 auto;
}

@media (max-width: 900px) {
  .friend-chat-page {
    padding: 16px;
  }

  .chat-shell {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 0;
  }
}
</style>
