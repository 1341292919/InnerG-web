<template>
    <div>
        <PageHead title = "情绪日志" />
        <TableSearch :formItem="formItem" @search="handleSearch"/>
        <el-table :data="tableData" style = "width : 100%;margin-top : 25px" >
            <el-table-column prop = "id" label = "用户ID" width = "80"/>
            <el-table-column label = "会话ID" width = "100">
                <template #default = "scope">
                    <el-avatar>{{ scope.row.nickname }}</el-avatar>
                </template>
            </el-table-column>
            <el-table-column prop = "diaryDate" label = "日记日期" width = "120"/>
            <el-table-column label = "情绪评分" width = "260" >
                <template #default = "scope">
                    <el-rate :model-value ="scope.row.moodScore" :max = "10" disabled />
                </template>
            </el-table-column>
            <el-table-column label = "生活指标" width = "120">
                <template #default = "scope">
                    <div>
                        <p>
                            睡眠:{{ scope.row.sleepQuality }} / 5
                        </p>
                        <p>
                            压力:{{ scope.row.stressLevel }} / 5
                        </p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop = "emotionTriggers" label = "情绪触发因素" width = "120"/>
            <el-table-column prop = "diaryContent" label = "日记内容"  />
            <el-table-column label="操作" width="240" fixed = "right" >
                <template #default="scope">
                    <el-button type="primary" text @click="viewMoodLogDetail(scope.row)">详情</el-button>
                    <el-button type="danger" text @click="deleteMoodLog(scope.row)">删除</el-button>
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
            v-model ="detailDialogVisible"
            title = "情绪日志详情"
            width = "800px"
            :close-on-click-modal = "false"
        >
            <div class = "detail-content">
                <div class ="detail-section">
                    <h4>用户信息</h4>
                    <el-descriptions :column = "2" border>
                    <el-descriptions-item label = "用户ID">{{currentMoodLogDetail.userId}}</el-descriptions-item>
                    <el-descriptions-item label = "昵称">{{currentMoodLogDetail.nickname}}</el-descriptions-item>
                    <el-descriptions-item label = "用户名">{{currentMoodLogDetail.username}}</el-descriptions-item>
                    <el-descriptions-item label = "记录日期">{{currentMoodLogDetail.diaryDate}}</el-descriptions-item>
               </el-descriptions>       
            </div>
            <div class ="detail-section">
                <h4>情绪状态</h4>
                <el-descriptions :column = "2" border>
                    <el-descriptions-item label = "情绪评分">
                        <el-rate :model-value ="currentMoodLogDetail.moodScore" :max = "10" disabled />
                    </el-descriptions-item>
                    <el-descriptions-item label = "主要情绪">
                        <el-tag :type="getEmotionTagType(currentMoodLogDetail.dominantEmotion)">{{currentMoodLogDetail.dominantEmotion || '-'}}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label = "睡眠质量">{{currentMoodLogDetail.sleepQuality || '-'}} / 5</el-descriptions-item>
                    <el-descriptions-item label = "压力水平">{{currentMoodLogDetail.stressLevel || '-'}} / 5</el-descriptions-item>
               </el-descriptions>       
            </div>
            <div class ="detail-section">
                <h4>日记详情</h4>
                <el-descriptions :column = "1" border>
                    <el-descriptions-item label = "情绪触发因素">{{currentMoodLogDetail.emotionTriggers || '无'}}</el-descriptions-item>
                    <el-descriptions-item label = "日记内容">{{currentMoodLogDetail.diaryContent || '无'}}</el-descriptions-item>
               </el-descriptions>       
            </div>
            <div class ="detail-section">
                <h4>AI情绪分析结果</h4>
                <div class = "ai-analysis-result">
                                    <el-descriptions :column = "2" border>
                    <el-descriptions-item label = "主要情绪">
                        <el-tag :type="getAiEmotionTagType(aiData.primaryEmotion)">{{aiData.primaryEmotion || '-'}}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label = "情绪强度">
                        <el-progress :percentage="aiData.emotionScore || 0 " :color="getEmotionScoreColor(aiData.emotionIntensity || 0)" :stroke-width = "8" />
                    </el-descriptions-item>
                    <el-descriptions-item label = "风险等级">
                        <el-tag :type="getAiEmotionTagType(aiData.riskLevel)">{{aiData.riskLevel || '-'}}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label = "情绪性质">
                        <el-tag :type="aiData.isNegative ? 'danger':'success'">{{aiData.isNegative ? '负面情绪':'正面情绪'}}</el-tag>
                    </el-descriptions-item>                       
               </el-descriptions>     
                </div>  
            </div>
            <div class = "ai-suggestion-section">
                <h5>专业建议</h5>
                <div class ="suggestion-content">{{aiData.suggestion}}</div>
            </div>
            <div class = "ai-risk-section">
                <h5>风险描述</h5>
                <div class ="risk-content">{{aiData.riskDescription}}</div>
            </div>
            <div class = "ai-improvements-section">
                <h5>改善建议</h5>
                <ul class = "improvement-list">
                    <li v-for = "item in aiData.improvementSuggestions":key ="item">{{item}}</li>
                </ul>
            </div>   
            </div>         
        </el-dialog>
    </div>
</template>

<script setup>
import PageHead from '../components/PageHead.vue'
import TableSearch from '../components/TableSearch.vue';
import { onMounted, ref,reactive } from 'vue';
import { moodLogPage } from '../api/backend/moodlog';

const formItem = [
    {comp: 'input', prop: 'userId', label: '用户ID', placeHolder: '请输入用户ID'},
    {comp:'select',prop:'moodScoreRange',label:'情绪评分范围',placeHolder:'请选择情绪评分范围',
        options:[
            {label:'0-2分',value:'0-2'},
            {label:'3-5分',value:'3-5'},
            {label:'6-8分',value:'6-8'},
            {label:'9-10分',value:'9-10'}
        ]
    }    
]

// 分页参数
const pagination = reactive({
   currentPage: 1,
   size: 10,
   total: 0
})

const handlePageChange = (page) =>{
    pagination.currentPage = page
    handleSearch()
}

const tableData = ref([])

const handleSearch = async (formData)=>{

    const params = {
        ...pagination,
        ...formData
    }
   const {records,total} =  await moodLogPage(params)
   tableData.value = records;
   pagination.total = total;

}

onMounted(()=>{
    handleSearch();
})

// 详情
const detailDialogVisible = ref(false)
const currentMoodLogDetail = ref(null)
const aiData = ref(null)
const viewMoodLogDetail = (row) => {
    currentMoodLogDetail.value = row;
    if (row.aiEmotionAnalysis){
        aiData.value = JSON.parse(row.aiEmotionAnalysis)
    } else {
        aiData.value = {}
    }
    detailDialogVisible.value = true;
}
const deleteMoodLog = (row) => {}


// 情绪映射
const getEmotionTagType = (emotion) => {
  const emotionTypes = {
    '快乐': 'success',
    '平静': 'info',
    '兴奋': 'warning',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning'
  }
  return emotionTypes[emotion] || 'info'
}

const getAiEmotionTagType = (emotion) => {
  const emotionTagMap = {
    '快乐': 'success',
    '平静': 'success',
    '兴奋': 'warning',
    '满足': 'success',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning',
    '恐惧': 'danger',
    '沮丧': 'info',
    '压力': 'warning'
  }
  return emotionTagMap[emotion] || 'info'
}

const getEmotionScoreColor = (score) => {
  if (score >= 80) return '#f56c6c'
  if (score >= 60) return '#e6a23c'
  if (score >= 40) return '#909399'
  return '#67c23a'
}

const getRiskLevelTagType = (riskLevel) => {
  const riskTagMap = {
    0: 'success',
    1: 'info',
    2: 'warning',
    3: 'danger'
  }
  return riskTagMap[riskLevel] || 'info'
}

const getRiskLevelText = (riskLevel) => {
  const riskTextMap = {
    0: '正常',
    1: '关注',
    2: '预警',
    3: '危机'
  }
  return riskTextMap[riskLevel] || '未知风险等级'
}
</script>

<style lang ="scss" scope>
.detail-content {
  .detail-section {
    margin-bottom: 24px;
    
    h4 {
      margin: 0 0 16px 0;
      color: #303133;
      font-size: 16px;
      
      i {
        margin-right: 8px;
        color: #409eff;
      }
    }
  }
}

// AI分析相关样式
.ai-analysis-status {
  .ai-status-tag {
    margin-bottom: 4px;
    
    i {
      margin-right: 4px;
    }
  }
  
  .ai-analysis-preview {
    font-size: 11px;
    color: #909399;
    margin-top: 2px;
  }
}

.ai-analysis-result {
  .ai-keywords-section,
  .ai-suggestion-section,
  .ai-risk-section,
  .ai-improvements-section {
    margin-top: 16px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 4px;
    
    h5 {
      margin: 0 0 8px 0;
      color: #606266;
      font-size: 14px;
      font-weight: 600;
      
      i {
        margin-right: 6px;
        color: #909399;
      }
    }
  }
  
  .keywords-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    
    .keyword-tag {
      background-color: #e1f3d8;
      color: #67c23a;
      border-color: #b3d8a4;
    }
  }
  
  .suggestion-content,
  .risk-content {
    line-height: 1.6;
    color: #606266;
    background-color: white;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
  }
  
  .improvement-list {
    margin: 0;
    padding-left: 20px;
    
    li {
      margin-bottom: 4px;
      color: #606266;
      line-height: 1.5;
    }
  }
  
  .ai-analysis-meta {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #ebeef5;
    
    .analysis-time {
      margin: 0;
      font-size: 12px;
      color: #909399;
      
      i {
        margin-right: 4px;
      }
    }
  }
  
  .el-progress {
    .el-progress__text {
      font-size: 12px !important;
    }
  }
}</style>