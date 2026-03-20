<template>
    <el-dialog
        :title = "isEditMode ? '编辑文章' : '创建文章'"
        v-model = "dialogVisible"
        width = "50%"
        @close = "handleClose"   
    >
    <el-form :model = "formData" :rules = "rules" ref = "formRef" label-width = "120px">
        <el-form-item label = "文章标题" prop = "title">
            <el-input v-model = "formData.title" placeholder="请输入文章标题"  maxlength="200" show-word-limit clearable/>
        </el-form-item>
        <el-form-item label = "文章分类" prop = "categoryId">
            <el-select v-model = "formData.categoryId" placeholder="请选择文章分类">
                <el-option 
                    v-for = "option in props.categoryOptions" 
                    :key = "option.value" 
                    :label="option.label" 
                    :value="option.value"/>
            </el-select>
        </el-form-item>
                <el-form-item label = "文章摘要" prop = "summary">
            <el-input v-model = "formData.summary" type="textarea" maxlength="1000"  show-word-limit placeholder="请输入文章摘要(可选)" :rows="4" />
        </el-form-item>
        <el-form-item label = "标签" prop = "tags">
            <el-select v-model = "formData.tagArray" placeholder="选择标签" multiple filterable allow-create style = "width: 100%;">
                <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag"/>
            </el-select>    
        </el-form-item>
        <el-form-item label = "封面图片" >
            <div class = "cover-upload">
                <el-upload
                    class="avatar-uploader"
                    action="#"
                    :show-file-list="false"
                    :http-request = "handleUpload"
                    :before-upload="beforeAvatarUpload"
                    accept="image/*"
                >   
                    <div v-if = "!imgUrl" class = "cover-placeholder">
                        <el-icon><i class="el-icon-plus"></i></el-icon>
                        <span>点击上传封面图片</span>
                    </div>
                    <img v-else class="cover-image" :src="imgUrl" alt="封面图片"/>
                </el-upload>
                <div v-if = "imgUrl" class = "cover-remove">
                    <el-button type="danger" size="small" @click="handleRemoveCover">移除封面</el-button>
                </div>
            </div>
        </el-form-item>
        <el-form-item label = "文章内容" prop = "content">
            <RichTextEditor
                v-model = "formData.content"
                placeholder = "请输入文章内容,支持富文本编辑"
                :maxCharCount  = "5000"
                @change="handleContentChange" 
                @create="handleEditorCreate"
                min-height = "400px"
            />
        </el-form-item>   
    </el-form>
    <div v-if ="btnPreview" class = "content-preview">
        <h3>内容预览</h3>
        <div v-html="formData.content" class = "preview-area"></div>
    </div>
    <template #footer>
        <el-button @click="btnPreview = !btnPreview">{{ btnPreview ? '隐藏预览' : '预览效果' }}</el-button>
        <el-button @click="handleClose">取消</el-button>       
        <el-button type = "primary" @click="handleSubmit" :loading="loading">{{ isEditMode ? '更新文章' : '创建文章' }}</el-button>
    </template>        
    </el-dialog>
</template>
<script setup>
import { ca } from 'element-plus/es/locales.mjs'
import {ref,reactive,computed,nextTick,watch} from 'vue'
import { ElMessage } from 'element-plus'
import { uploadFile,createArticle,updateArticle } from '../api/backend/knowledge';
import { fileBaseUrl } from '../config/config';
import RichTextEditor from './RichTextEditor.vue'
// <!-- Vue 规定 props 是只读的，不能直接修改 -->
const props = defineProps({
    paramToDialog :{
        type : Boolean,
        default : false
    },
    categoryOptions : {
        type : Array,
        default : () => []
    },
    article :{
        type : Object,
        default : null
    }
})

const emit = defineEmits(['update:paramToDialog','success'])

const dialogVisible = computed({
    get(){
        return props.paramToDialog
    },
    set(val){
        emit('update:paramToDialog',val)
    }
})

// 判断是否为编辑模式
const isEditMode = computed(() => !!props.article?.id) // !!转bool

// 监听编辑数据
watch(() => props.article, (newVal) => {
    if (newVal) {
        nextTick(() => {
            formData.title = newVal.title || ''
            formData.categoryId = newVal.categoryId || ''
            formData.summary = newVal.summary || ''
            formData.content = newVal.content || ''
            formData.id = newVal.id || '' // 编辑时有id，创建时为空
            formData.tagArray = newVal.tags ? newVal.tags.split(',') : [] // 将逗号分隔的字符串转换为数组
            imgUrl.value = fileBaseUrl + newVal.coverImage
        })
    } 
})

const handleClose =()=>{
    dialogVisible.value = false
    formRef.value.resetFields()
    formData.id = ''  // 关键：重置 id 字段为空
    // 重置封面图片和数据
    handleRemoveCover()
    formData.tagArray = []
}


// 表单数据
const formData = reactive({
    "title":'',
    "categoryId":1,
    "content": "",
    "summary": "",
    "tagArray":[],
    "id":"",
    "coverImage":""
})

const rules = reactive({
    title:[
        {required:true,message:'请输入文章标题',trigger:'blur'},
        {max:200,message:'文章标题不能超过200字',trigger:'blur'}
    ],
    categoryId:[
        {required:true,message:'请选择文章分类',trigger:'change'}
    ],
    content:[
        {required:true,message:'请输入文章内容',trigger:'blur'},
        {max:5000,message:'文章内容不能超过5000字',trigger:'blur'}
    ],
})

const commonTags = ref([
    "情绪","开导","新世界"
])

const imgUrl = ref('')

const beforeAvatarUpload = (file) => {
    const IsImage = file.type.startsWith('image/') 
    const isLt5M = file.size / 1024 / 1024 < 5
    if (!IsImage) {
        ElMessage.error('只能上传图片文件！')
        return false
    }
    if (!isLt5M) {
        ElMessage.error('图片大小不能超过5MB！')
        return false
    }
    return true
}

const handleUpload = async ({file}) => {
    // 生成一份UId
    const businessId =  crypto.randomUUID()

    const resp = await uploadFile(file, { businessId })

    imgUrl.value = fileBaseUrl + resp.filePath
    
    formData.coverImage = resp.filePath

    console.log(imgUrl)
}

const handleRemoveCover = () => {
    imgUrl.value = ''
    formData.coverImage = ''
}
// 富文本
const handleContentChange = (newContent) => {
    console.log(newContent)
    formData.content = newContent.html
}

const editorInstance = ref(null)
const handleEditorCreate = (editor) => {
    editorInstance.value = editor
    if (formData.content && editor ){
        nextTick(() => {
            editor.setHtml(formData.content)
        })
    }
}

const btnPreview = ref(false)

// 提交
const formRef = ref(null)
const loading = ref(false)
const handleSubmit = () =>{
    formRef.value.validate((valid,fields) => {
        if (valid){
            loading.value = true
        }
        const submitData ={
            ...formData,
            tags:formData.tagArray.join(',')
        }
        delete submitData.tagArray

        if (isEditMode.value){
            updateArticle(props.article.id, submitData).then(resp => {
                loading.value = false
                emit('success')
                ElMessage.success('文章更新成功')
                handleClose()
            })
            return
        }else{
            createArticle(submitData).then(resp => {
                loading.value = false
                emit('success')
                ElMessage.success('文章创建成功')
                handleClose()
            })
        }
    })
}

</script>

<style lang ="scss" scoped>
.cover-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 120px;
    border: 2px dashed #d9d9d9;
    border-radius: 4px;
    color: #8e8a8a;
    background-color: #f6f8fa;
}
.cover-image{
    width: 200px;
    height: 120px;
    display: block;
}
</style>

