<template>
    <div class = "consultation-container">
        <div class = "sidebar">
            <div class = "ai-assistant-info">
                <div class = "breathing-circle">
                    <el-image style = "width:40px;height:40px" :src = "iconUrl" alt="图标"/>
                </div>
                <h3 class="assistant-name">AI助手</h3>
                <div class = "online-status">
                    <div class="status-dot"></div>
                    在线服务中
                </div>
            </div>
            <!-- 会话历史 -->
            <div class="session-history" >
                <h4 class = "section-title">会话列表</h4>
                <div class="session-list">
                    <div v-for = "session in sessionList" :key="session.SessionId" @click="handleSelectSession(session)" class="session-item">
                        <div class = "session-info">
                            <div class = "session-title">
                                <span>{{ session.Title }}</span>
                                <div class ="session-meta">
                                    <span class ="session-time">{{ session.UpdatedAt ? new Date(session.UpdatedAt * 1000).toLocaleString() : '' }}
                                    </span>
                                </div>
                                <div class ="session-preview">
                                    {{ session.LastMessage }}
                                </div>
                                <div class="session-stats">
                                    <span>
                                        <el-icon>
                                            <ChatRound/>
                                        </el-icon>
                                        {{ session.MessageCount || 0 }}
                                    </span>
                                    <span>
                                        <el-icon>
                                            <Clock/>
                                        </el-icon>
                                        {{ session.MessageCount || 2 }} 分钟
                                    </span>
                                </div>
                            </div>
                            <div class="session-actions">
                                <el-button text type = "danger" size = "small" @click="handleDeleteSession(session)">
                                    <el-icon>
                                        <DeleteFilled/>
                                    </el-icon>
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class = "chat-main">
            <div class = "chat-header">
                <div class = "header-left">
                    <div class="chat-avatar">
                        <el-image style = "width:30px;height:30px" :src = "avatarUrl" alt="头像"/>
                    </div>
                    <div class = "chat-info">
                        <h2>InnerG助手</h2>
                        <p>您的贴心AI心灵健康助手</p>
                    </div>
                </div>
                <el-button circle @click = "createNewSession" title ="新建会话">
                    <el-icon>
                        <Plus/>
                    </el-icon>
                </el-button>
            </div>
            <div class = "chat-messages">
                <!--默认的欢迎消息-->
                <div class = "message-item ai-message" v-if = "messagesList.length === 0">
                    <div class = "message-avatar">
                        <el-image :src = "avatarUrl" style="width: 20px; height: 20px;"/>
                    </div>
                    <div class = "message-content">
                        <div class = "message-bubble">
                            <p>你好！我是小G，很高兴为你提供心灵健康方面的支持和帮助。无论你有什么问题或需要什么建议，都可以随时告诉我。我会尽力为你提供有用的信息和温暖的陪伴。请问有什么我可以帮你的吗？</p>
                        </div>
                        <div class="message-time">刚刚</div>
                    </div>    
                </div>
                <!--对话消息列表-->
                <div v-for = "(msg, index) in messagesList" :key="`${msg.Role}-${msg.CreatedAt}-${index}`" class = "message-item" :class = "msg.Role === 'assistant' ? 'ai-message' : 'user-message'">
                    <div class = "message-avatar">
                        <el-image v-if="msg.Role === 'user'" :src = "userAvatarUrl" style="width: 30px; height: 30px;border-radius: 50%; object-fit: cover;"/>
                        <el-image v-if="msg.Role === 'assistant'" :src = "avatarUrl" style="width: 25px; height: 25px;"/>
                    </div>
                    <div class="message-content">
                        <div class = "message-bubble">
                            <!--AI思考中-->
                            <div v-if = "msg.Role === 'assistant' && isAiTyping && !msg.Content" class = "typing-indicator">
                                <div class = "typing-dot"></div>
                                <div class = "typing-dot"></div>
                                <div class = "typing-dot"></div>
                            </div>
                            <!--T0DO:AI错误提示-->
                            <!--消息内容-->
                            <MarkdownRenderer v-else-if ="msg.Role  === 'assistant'" :content="msg.Content" :is-ai-message="true"></MarkdownRenderer>
                            <p v-else-if ="msg.Role === 'user'" v-html="formatMessageContent(msg.Content)"></p>
                        </div>
                        <div class = "message-time">{{ msg.Role  === 'assistant' && isAiTyping ? "正在输出中...":new Date(msg.CreatedAt * 1000).toLocaleString()  }}</div>
                    </div>
                </div>
            </div>
            <div class ="chat-input">
                <div class = "input-container">
                    <el-input
                        v-model="userMessage"
                        placeholder="请输入你想分享的内容..."
                        type="textarea"
                        :rows="3"
                        :disable="isAiTyping"
                        @keyup.enter="sendMessage"
                        class="message-input"
                        style="font-family: 'Microsoft YaHei', sans-serif; font-size: 14px;"
                        clearable
                    />
                    <div class = "input-footer">
                        <span class = "input-hint">按 Enter 发送消息</span>
                        <span>{{ userMessage.length }} / 1000</span>
                    </div>
                </div>
                <el-button :disabled="isAiTyping || userMessage.length > 1000 || !userMessage.trim()" type="primary" @click = "sendMessage" class = "send-btn" circle title="发送消息">
                    <el-icon>
                        <Promotion/>
                    </el-icon>
                </el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ChatRound, DeleteFilled, Promotion } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { el } from 'element-plus/es/locales.mjs';
import{onMounted, ref}from 'vue'
import { newSession, getSessionList,getSessionDetail } from '../api/consult/consult'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'
import { fetchEventSource } from '@microsoft/fetch-event-source';

const iconUrl = new URL('../assets/pig.svg', import.meta.url).href
const avatarUrl = new URL('../assets/pig.svg', import.meta.url).href
const userAvatarUrl = localStorage.getItem('userAvatar') ? localStorage.getItem('userAvatar') : new URL('../assets/brand_icon.svg', import.meta.url).href

// 新建会话
const createNewSession = () => {
    const newSession = {
        SessionId: '',
        Title: '新会话',
        status: 'TEMP',   
    }
    currentSession.value = newSession
    messagesList.value = []
}

const currentSession = ref(null)


const isAiTyping = ref(false)
const userMessage = ref('')
// 用户发送信息
const sendMessage =()=>{
    if(userMessage.value.trim() === '') return
    if (isAiTyping.value) {
        ElMessage.warning('AI正在思考回复，请稍后...')
        return
    }
    const message = userMessage.value.trim()
    userMessage.value = ''
    // 判断会话类型
    if (currentSession.value.status === 'TEMP' ){
        startNewSession(message)
    }else{
        // 添加用户发送消息至消息列表中
        messagesList.value.push({
            Role: 'user',
            Content: message,
            CreatedAt: Math.floor(Date.now() / 1000)
        })
        startAIResponse(currentSession.value.SessionId,message)
    }
}
const startNewSession = (message) => {
    // 调接口
    newSession().then(res =>{
        if (res.data.code != 10000){
            ElMessage.error('会话创建失败，请稍后再试')
            return
        }
        currentSession.value.SessionId = res.data.data.SessionId
        currentSession.value.status = 'ACTIVE'
        getSessionListByPage()
        messagesList.value.push({
            Role: 'user',
            Content: message,
            CreatedAt: Math.floor(Date.now() / 1000)
        })
        startAIResponse(currentSession.value.SessionId,message)
    }).catch(err =>{
        ElMessage.error('网络异常，请稍后再试')
    })
}

// 发送信息
const startAIResponse = (sessionId,userMessage) => {
    if (isAiTyping.value) {
        ElMessage.warning('AI正在思考回复，请稍后...')
        return
    }
    isAiTyping.value = true

    const aiMessgae = {
        Role: 'assistant',
        Content:'',
        CreatedAt: Math.floor(Date.now() / 1000)
    }
    messagesList.value.push(aiMessgae)

    // 调用流式接口
    const abortController = new AbortController() //用来中止fetch请求的
    fetchEventSource(`api/v1/contact/session/stream`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('accessToken'),
            'Accept': 'text/event-stream'
        },
        body: JSON.stringify({
            userMessage: userMessage,
            sessionId: sessionId,
        }),
        signal: abortController.signal,
        onopen:(response) =>{
            console.log(response)
            if (response.headers.get('Content-Type') !== 'text/event-stream') {
                ElMessage.error('服务器返回数据格式错误')
            }
        },
        onmessage:(event)=>{
            const raw =  event.data.trim() 
            if (!raw) return
            const eventName = event.event 

            const aiMessage = messagesList.value[messagesList.value.length - 1]
            if (eventName === 'done'){
                isAiTyping.value = false
                aiMessage.CreatedAt = Math.floor(Date.now() / 1000)
                abortController.abort() //停止请求
                return
            }
            const payload = JSON.parse(raw)
            const ok = String(payload.Code) == '10000'
            if (!ok){
                handleStreamError(payload.message || 'AI回复失败')
            }else{
                aiMessage.Content += payload.Data.Content
            }

        },
        onerror:(err) =>{
            handleStreamError(err)
            throw err
        },
        onclose:()=>{
            getSessionListByPage()
            isAiTyping.value = false
        }
    })
}


const handleStreamError = (error)=>{
     const aiMessage = messagesList.value[messagesList.value.length - 1]
     if (aiMessage){
        aiMessage.Content = 'AI回复失败，请稍后再试'
     }
     isAiTyping.value = false
    ElMessage.error('AI回复失败，请稍后再试')
}

onMounted(()=>{
    createNewSession()
    getSessionListByPage()
})

// 会话历史列表
const sessionList = ref([])

const getSessionListByPage =()=>{
    getSessionList({pageNum : 1, pageSize: 10}).then(res =>{
        if (res.data.code != 10000){
            ElMessage.error('会话列表获取失败，请稍后再试')
            return
        }
        // 将返回的会话列表绑定到页面
        sessionList.value = res.data.data.SessionList
    }).catch(err =>{
        ElMessage.error('网络异常，请稍后再试')
    })
}

const handleSelectSession =(session) =>{
    getSessionDetail(session.SessionId).then(res =>{
        if (res.data.code != 10000){
            ElMessage.error('会话详情获取失败，请稍后再试')
            return
        }
        // 将返回的会话详情绑定到页面
        messagesList.value = res.data.data.SessionDetail.Messages
        // 绑定当前会话数据
        currentSession.value.SessionId = res.data.data.SessionDetail.SessionId
        currentSession.value.Title = res.data.data.SessionDetail.Title
        currentSession.value.status = 'ACTIVE'
    }).catch(err =>{
        ElMessage.error('网络异常，请稍后再试')
    })
} 

const handleDeleteSession =(session) =>{

}

// 定义对话消息数据
const messagesList = ref([])

// 处理简单的换行逻辑
const formatMessageContent = (content) => {
    return content.replace(/\n/g, '<br>')
}

</script>



<style scoped lang = "scss">
.consultation-container {
    margin: 0 auto;
    width: 1200px;
    display: flex;
    gap: 20px;
    padding: 20px;
    min-height: 100%;
    .sidebar {
        width: 320px;
        .ai-assistant-info {
            margin-bottom: 20px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 8px 32px rgba(251, 146, 60, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04);
            border: 1px solid rgba(251, 146, 60, 0.08);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            .breathing-circle {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 12px;
                animation: breathing 4s ease-in-out infinite;
                box-shadow: 0 6px 24px rgba(251, 146, 60, 0.25);
                position: relative;
            }
            .assistant-name {
                font-size: 16px;
                font-weight: 700;
                background: linear-gradient(135deg, #fb923c, #f59e0b);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-align: center;
                background-clip: text;
                margin: 0 0 12px;
            }
            .online-status {
                display: flex;
                align-items: center;
                justify-content: center;
                color: #059669;
                font-size: 12px;
                font-weight: 600;
                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: #059669;
                    border-radius: 50%;
                    margin-right: 8px;
                    animation: pulse 2s infinite;
                    box-shadow: 0 0 8px rgba(5, 150, 105, 0.4);
                }
            }
        }
        .session-history {
            background: white;
            border-radius: 16px;
            padding: 14px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
            min-height: 250px;
            display: flex;
            flex-direction: column;
            .section-title {
                font-size: 16px;
                font-weight: 1000;
                color: #090909;
                margin: 0 0 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                
            }
            .session-list {
                overflow-y: auto;
                max-height: 200px;
                scrollbar-width: thin;
                scrollbar-color: rgba(64, 150, 255, 0.3) transparent;
                .session-item {
                    background-color: #f1e6d6;
                    position: relative;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 8px 12px 8px 12px;
                    margin-bottom: 8px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                    &:hover {
                        background: #e2e3ea;
                        border-color: #d5dfee;
                    }
                    &.active {
                        background: #e6f0ff;
                        border-color: #4096ff;
                    }
                    .session-info {
                        flex: 1;
                        .session-title {
                            font-weight: 1000;
                            font-size: 14px;
                            color: #090909;
                            margin-bottom: 4px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            .session-meta {
                                display: flex;
                                align-items: center;
                                gap: 8px;
                                margin-bottom: 2px;
                                margin-top: 4px;
                                .session-time {
                                    font-size: 12px;
                                    color: #999;
                                }
                            }
                            .session-preview {
                                width: 200px;
                                font-size: 12px;
                                color: #666;
                                margin-bottom: 6px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                            .session-stats {
                                display: flex;
                                align-items: center;
                                gap: 12px;
                                span {
                                    font-size: 12px;
                                    color: #999;
                                    display: flex;
                                    align-items: center;
                                    gap: 4px;
                                }
                            }
                        }
                        .session-actions {
                            position: absolute;
                            top: 10px;
                            right: 12px;
                        }
                    }
                }
                .no-sessions-text {
                    text-align: center;
                    font-size: 14px;
                    color: #999;
                }
            }
        }
        .emotion-garden {
            background: linear-gradient(135deg, #fef9e7 0%, #fcf4e6 50%, #f6f0e8 100%);
            border-radius: 20px;
            padding: 16px;
            margin-bottom: 20px;
            box-shadow: 0 8px 32px rgba(252, 244, 230, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.2);
            position: relative;
            overflow: hidden;
            min-height: 300px;
            
            .garden-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
                position: relative;
                z-index: 2;
                .garden-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #8b4513;
                }
            }
            .emotion-info {
                margin: 0 auto;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 10;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.8);
                background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
                color: #fff;
                .emotion-name {
                    font-size: 15px;
                    font-weight: 600;
                    line-height: 1;
                    margin-bottom: 2px;
                }
                .emotion-score {
                    font-size: 14px;
                    font-weight: 700;
                    opacity: 0.9;
                }
            }
            .warm-tips {
                text-align: center;
                margin-bottom: 16px;
                .emotion-status-text {
                    margin-bottom: 12px;
                    .status-label {
                        font-size: 14px;
                        color: #8b7355;
                        margin-right: 8px;
                    }
                    .status-emotion {
                        font-size: 16px;
                        font-weight: 600;
                        padding: 4px 12px;
                        border-radius: 16px;
                        display: inline-block;
                    }
                }
                .emotion-intensity {
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    .intensity-dots {
                        display: flex;
                        gap: 4px;
                        .dot {
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            background: #e0e0e0;
                            transition: all 0.3s ease;
                            &.active {
                                background: linear-gradient(135deg, #ff9a9e, #fecfef);
                                transform: scale(1.2);
                                box-shadow: 0 2px 8px rgba(255, 154, 158, 0.4);
                            }
                        }
                    }
                    .intensity-text {
                        font-size: 12px;
                        color: #8b7355;
                        font-weight: 500;
                    }
                }
                .warm-suggestion {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
                    border-radius: 16px;
                    padding: 12px;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
                    .suggestion-icon {
                        font-size: 20px;
                        flex-shrink: 0;
                        margin-top: 2px;
                    }
                    .suggestion-content {
                        text-align: left;
                        flex: 1;
                        .suggestion-title {
                            font-size: 14px;
                            font-weight: 600;
                            color: #8b7355;
                            margin-bottom: 6px;
                        }
                        .suggestion-text {
                            font-size: 13px;
                            color: #6b5b47;
                            line-height: 1.5;
                        }
                    }
                }
                .healing-actions {
                    margin-bottom: 16px;
                    .actions-title {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        font-size: 14px;
                        font-weight: 600;
                        color: #8b7355;
                        margin-bottom: 16px;
                    }
                    .actions-list {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        .action-item {
                            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
                            border-radius: 12px;
                            padding: 12px;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            border: 1px solid rgba(255, 255, 255, 0.5);
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
                            text-align: left;
                            .action-icon {
                                font-size: 14px;
                                color: #ffd700;
                                flex-shrink: 0;
                            }
                            .action-text {
                                font-size: 12px;
                                color: #6b5b47;
                                line-height: 1.4;
                                flex: 1;
                            }
                        }
                    }
                }
                .risk-notice {
                    background: linear-gradient(135deg, #fff9e6, #ffeaa7);
                    border-radius: 16px;
                    padding: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    border: 1px solid rgba(255, 234, 167, 0.6);
                    box-shadow: 0 6px 20px rgba(255, 234, 167, 0.3);
                    .notice-icon {
                        font-size: 20px;
                        flex-shrink: 0;
                        margin-top: 2px;
                    }
                    .notice-content {
                        flex: 1;
                        .notice-title {
                            font-size: 14px;
                            font-weight: 600;
                            color: #d4840f;
                            margin-bottom: 6px;
                        }
                        .notice-text {
                            font-size: 13px;
                            color: #b8740c;
                            line-height: 1.5;
                        }
                    }
                }
            }
        }
    }
    .chat-main {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 252, 250, 0.98) 100%);
        border-radius: 20px;
        box-shadow: 0 12px 40px rgba(251, 146, 60, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
        border: 1px solid rgba(251, 146, 60, 0.1);
        backdrop-filter: blur(10px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        flex: 1;
        .chat-header {
            background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
            color: white;
            padding: 20px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            flex-shrink: 0;
            .header-left {
                display: flex;
                align-items: center;
                .chat-avatar {
                    width: 48px;
                    height: 48px;
                    background: rgba(255, 255, 255, 0.25);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 16px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    position: relative;
                    z-index: 1;
                }
                .chat-info {
                    h2 {
                        font-size: 20px;
                        font-weight: 700;
                        margin-bottom: 4px;
                    }
                    p {
                        margin-top:5px;
                        font-size: 13px;
                        font-weight: 600;
                        color: #e4dcdc;
                    }
                }
            }
        }
        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 252, 248, 0.05) 100%);
            min-height: 0;
            max-height: calc(100vh - 200px);
            scrollbar-width: thin;
            scrollbar-color: rgba(251, 146, 60, 0.3) transparent;
            .message-item {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                .message-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: white;
                    flex-shrink: 0;
                }
                &.ai-message {
                    .message-avatar {
                        background: linear-gradient(135deg, #fb923c, #f59e0b);
                        box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3);
                    }
                }
                &.user-message {
                    .message-avatar {
                        background: linear-gradient(135deg, #6b7280, #4b5563);
                        box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
                    }
                }
                .message-content {
                    max-width: 70%;
                    .message-bubble {
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
                        border-radius: 16px;
                        padding: 12px 16px;
                        position: relative;
                        animation: fadeInUp 0.4s ease-out;
                        border: 1px solid rgba(251, 146, 60, 0.1);
                        box-shadow: 0 4px 16px rgba(251, 146, 60, 0.05);
                        .typing-indicator {
                            display: flex;
                            gap: 4px;
                            padding: 8px 0;
                            .typing-dot {
                                width: 8px;
                                height: 8px;
                                background: #ccc;
                                border-radius: 50%;
                                animation: typing 1.5s ease-in-out infinite;
                                &:nth-child(2) {
                                    animation-delay: 0.2s;
                                }
                                &:nth-child(3) {
                                    animation-delay: 0.4s;
                                }   
                            }
                        }
                        /* 错误消息样式 */
                        .error-message {
                            background: linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%);
                            border: 1px solid #F87171;
                            border-radius: 12px;
                            padding: 12px 16px;
                            color: #991B1B;
                            font-weight: 500;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        }
                    }
                    .message-time {
                        font-size: 12px;
                        color: #999;
                        margin-top: 4px;
                    }
                }
            }
        }
        .chat-input {
            border-top: 1px solid rgba(251, 146, 60, 0.1);
            padding: 20px 24px;
            display: flex;
            gap: 12px;
            align-items: flex-end;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 252, 248, 0.7) 100%);
            backdrop-filter: blur(10px);
            flex-shrink: 0;
            .input-container {
                flex: 1;
            }
            .input-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                color: #78716c;
                font-weight: 500;
                margin-top: 10px;
            }
            .send-btn {
                height: 60px;
                width: 60px;
                border-radius: 16px;
                background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%) !important;
                border: none !important;
                box-shadow: 0 6px 20px rgba(251, 146, 60, 0.25);
                transition: all 0.3s ease;
            }

        }

    }
}
</style>