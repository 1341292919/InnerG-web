<template>
    <div>
        <PageHead title="知识文章">
            <template #buttons>
                <el-button type="primary" @click="dialogVisible = true; currentArticle = null">新增</el-button>
            </template>
        </PageHead>
        <TableSearch :formItem = "formItem" @search = "handleSearch"/>
        <el-table :data = "tableData" style = "width : 100%;margin-top : 25px">  
            <el-table-column label = "文章标题" width = "300" fixed="left">
                <template #default = "scope">
                    <div style = "display : flex;align-items:center">
                        <el-icon><timer /></el-icon>
                        <span>{{scope.row.title}}</span>
                    </div>    
                </template>
            </el-table-column>
            <el-table-column label = "分类" width = "200">
                <template #default = "scope">
                    <div style = "display : flex;align-items:center">
                        <span>{{categoryMap[scope.row.categoryId]}}</span>
                    </div>    
                </template>
            </el-table-column>
            <el-table-column prop = "authorName" label = "作者" width = "150"/>
            <el-table-column  prop = "readCount" label = "阅读量" width = "150"/>
            <el-table-column prop ="updatedAt" label = "发布时间" width = ""/>
            <el-table-column label = "操作" fixed="right" width = "200" >
                <template #default = "scope">
                    <el-button text type="primary" size="small" @click = "handleEditArticle(scope.row)">编辑</el-button>
                    <el-button @click = "handlePublish(scope.row)" v-if = "scope.row.status === 0 || scope.row.status===2"text type = "success" size="small" >发布</el-button>    
                    <el-button @click = "handleUnPublish(scope.row)" v-if = "scope.row.status === 1"text type = "warning" size="small">下线</el-button>
                    <el-button @click = "handleDeleteArticle(scope.row)" text type="danger" size="small">删除</el-button>
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
        <ArticleDialog v-model:paramToDialog="dialogVisible ":article = "currentArticle" :categoryOptions="categories" @success = "handleSuccess"/>
        <!--   
                等价于
                <ArticleDialog :paramToDialog="dialogVisible" 
                @update:paramToDialog="value => dialogVisible = value"/>
                :paramToDialog="dialogVisible" 声明的变量能被子组件捕捉
          -->
    </div>
</template>

<script setup>
import PageHead from '../components/PageHead.vue'
import TableSearch from '../components/TableSearch.vue'
import { categoryTree, articlePage,getArticleDetail, changeArticleStatus,deleteArticle} from '../api/backend/knowledge';
import { onMounted, reactive,ref } from 'vue';
import ArticleDialog from '../components/ArticleDialog.vue'
import { ElMessageBox,ElMessage } from 'element-plus';

const formItem = [
    // prop 一般与后端参数保持一致
    {
        comp :'input',prop: 'title',label: '文章标题',placeHolder: '请输入文章标题'
    },
    {
        comp :'select',prop: 'categoryId',label: '分类',placeHolder: '请选择分类',
    },
    {
        comp :'select',prop: 'status',label: '状态',placeHolder: '请选择状态',
        options:[
            {
                label:'草稿',
                value:0
            },
            {
                label:'已发布',
                value:1
            },
            {
                label:'已下线',
                value:2
            }
        ]
    }
]

// 分页参数
const pagination = reactive({
    currentPage: 1,
    size: 10,
    total:0
})

const handleSearch = async (formData) => {
    
    const params = {
        ...pagination,
        ...formData
    }
   const {records,total} =  await articlePage(params)
   tableData.value = records;
   pagination.total = total;
}

const handlePageChange = (page) =>{
    pagination.currentPage = page
    handleSearch()
}

// 分类的映射
const categoryMap = reactive({})
// 分类列表
const categories = ref([])

// 列表数据
const tableData = ref([])

// 新增和编辑
const dialogVisible = ref(false)

onMounted(async () => {
    const data = await categoryTree()

    categories.value = data.map(item => {
        categoryMap[item.id] = item.categoryName;
        return{
            label:item.categoryName,
            value:item.id
        }
    })
    formItem[1].options = categories.value;

    // 获取列表
    handleSearch({})
})

const handleSuccess = ()=>{
    dialogVisible.value = false
    handleSearch()
}

const currentArticle = ref(null)
const handleEditArticle = (row) => {
    console.log('编辑文章',row)
    if (!row.id) return
    getArticleDetail(row.id).then(resp => {
        console.log('文章详情',resp)
        currentArticle.value = resp
        dialogVisible.value = true
    })
}

const handlePublish = (row)=>{
    ElMessageBox.confirm(
        `确认发布文章${row.title}吗？`,
        `确认`,
        {
            confirmButtonText :'确认发布',
            cancelButtonText:'取消',
            type :'info'
        }
    ).then(()=>{
        changeArticleStatus(row.id,{status:1}).then(res => {
            ElMessage.success('发布成功')
            handleSearch()
        })
    })
}

const handleUnPublish = (row) =>{
        ElMessageBox.confirm(
        `确认下线文章${row.title}吗？`,
        `确认`,
        {
            confirmButtonText :'确认下线',
            cancelButtonText:'取消',
            type :'warning'
        }
    ).then(()=>{
        changeArticleStatus(row.id,{status:2}).then(res => {
            ElMessage.success('下线成功')
            handleSearch()
        })
    })
}
const handleDeleteArticle = (row)=>{
    ElMessageBox.confirm(
        `确认删除文章${row.title}吗？`,
        `确认`,
        {
            confirmButtonText :'确认删除',
            cancelButtonText:'取消',
            type :'danger'
        }
    ).then(()=>{
        deleteArticle(row.id).then(res => {
            ElMessage.success('删除成功')
            handleSearch()
        })
    })
}
</script>