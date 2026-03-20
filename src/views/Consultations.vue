<template>
   <div>
      <PageHead title="咨询记录" />
      <el-table :data="tableData" style="width: 100%">
         <el-table-column label="ID" width="120" >
            <template #default="scope">
               <div class = "session-id" style = "display: flex; align-items: center; gap: 10px;">
                  <span>{{ scope.row.id }}</span>
                  <el-avatar>{{ scope.row.userNickname }}</el-avatar>
               </div>
            </template>
         </el-table-column>
         <el-table-column label="情绪日志" >
            <template #default="scope">
               <div class = "session-title">{{ scope.row.sessionTitle }}</div>
               <div class = "session-preview">{{ scope.row.lastMessageContent }}</div>
            </template>
         </el-table-column> 
         <el-table-column prop = "messageCount" label = "消息数" width = "100" />
         <el-table-column prop = "lastMessageTime" label = "时间" width = "100"/>
         <el-table-column label="操作" width="100" >
            <template #default="scope">
               <el-button type="primary" text @click="viewSessionDetail(scope.row)">查看</el-button>
            </template>
         </el-table-column>    
      </el-table>
      <div style="display: flex; justify-content: center; margin-top: 20px;">
            <el-pagination
                :page-size="pagination.size"
                layout="prev, pager, next"
                :total="pagination.total"
                 @change="handlePageChange"
            />
      </div>
      <el-dialog 
         v-model = "showDetailDialog"
         title="咨询会话详情"
         width="70%"
      >
         <div class="session-detail">
            <div class ="detail-header">
               <div class = "detail-row">
                  <div class= "detail-label">用户：</div>
                  <div class= "detail-value">{{ sessionDetail.userNickname }}</div>
               </div>
               <div class = "detail-row">
                  <div class= "detail-label">开始时间：</div>
                  <div class= "detail-value">{{ sessionDetail.startedAt }}</div>
               </div>
               <div class = "detail-row">
                  <div class= "detail-label">消息数：</div>
                  <div class= "detail-value">{{ sessionDetail.messageCount }}</div>
               </div>
               <div class = "detail-row">
                  <div class= "detail-label">咨询主题：</div>
                  <div class= "detail-value">{{ sessionDetail.sessionTitle }}</div>
               </div>
            </div>
            <div class ="detail-main">
               <div class = "messages-header">
                  <h4>对话记录</h4>
               </div>
               <div class = "messages-list" v-loading = "loadingMessages">
                  <div v-for="message in sessionMessages" :key="message.id" class="messages-item" :class="message.senderType === 1 ? 'user-messages':'ai-messages'">
                     <div class = "messages-header">
                        <span class = "sender">{{ message.senderType === 1 ? '用户':'AI助手' }}</span>
                        <span class = "time">{{ message.createdAt }}</span>
                     </div>
                     <div class ="messages-content">{{ message.content }}</div>   
                  </div>
               </div>   
            </div>  
         </div>
         <template #footer>
            <el-button type = "primary" @click="showDetailDialog = false">关闭</el-button>
         </template>   
      </el-dialog>
   </div>
</template>
<script setup>
import PageHead from '../components/PageHead.vue'
import { consultationPage,getSessionDetail } from '../api/backend/consultations'
import { onMounted ,ref,reactive} from 'vue';
import { el, ta } from 'element-plus/es/locales.mjs';

const tableData = ref([])

const pagination = reactive({
   currentPage: 1,
   size: 10,
   total: 0
})

onMounted(() => {
   handleSearch()
}) 

const sessionDetail = ref({})
const sessionMessages = ref([])
const loadingMessages = ref(false)

const viewSessionDetail = (row) => {
   loadingMessages.value = true
   showDetailDialog.value = true
   getSessionDetail(row.id).then(res => {
      sessionMessages.value = res
      sessionDetail.value = row
      loadingMessages.value = false
   })
}

const handleSearch = () =>{
   consultationPage(pagination).then(res => {
      const { records,total} = res
      tableData.value = records
      pagination.total = total
   })
}

const handlePageChange = (page) => {
   pagination.currentPage = page
   handleSearch()
}

// 咨询详情
const showDetailDialog = ref(false)

</script>

<style scoped lang = "scss">
.session-title {
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }
  .session-preview {
    font-size: 13px;
    color: #666;
    margin-bottom: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .session-detail {
    max-height: 70vh;
    overflow-y: auto;
    .detail-header {
      margin-bottom: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }

    .detail-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      :last-child {
        margin-bottom: 0;
      }
      .detail-label {
        font-weight: 500;
        color: #495057;
        min-width: 80px;
        margin-right: 8px;
      }

      .detail-value {
        color: #333;
      }
    }
  }
  .detail-main {
    margin-top: 20px;
    .messages-header {
      margin-bottom: 16px;
      h4 {
        margin: 0;
        color: #333;
        font-size: 16px;
        font-weight: 500;
      }
    }
    .messages-list {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 16px;
      background: #fff;
      .messages-item {
        margin-bottom: 12px;
        padding: 12px;
        border-radius: 8px;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        :last-child {
          margin-bottom: 0;
        }
        &.user-messages {
          background: #e8f4fd;
        }

        &.ai-messages {
          background: #f0f9f0;
        }
      }
      .messages-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        .sender {
          font-weight: 500;
          color: #333;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .time {
          font-size: 12px;
          color: #999;
        }

        .messages-content {
          color: #333;
          line-height: 1.6;
          white-space: pre-wrap;
          margin-top: 8px;
          font-size: 14px;
        }
      }
    }
  }</style>
