<template>
    <div class="user-info-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>个人信息</h3>
                <el-icon class="close-icon" @click="handleClose">
                    <Close />
                </el-icon>
            </div>
            
            <div class="modal-body">
                <!-- 头像区域 -->
                <div class="avatar-section">
                    <div class="avatar-wrapper" @click="triggerUpload">
                        <el-avatar :src="userInfo.Avatar" class="user-avatar" :size="80" />
                        <div class="avatar-overlay">
                            <el-icon><Camera /></el-icon>
                            <span>{{ uploadLoading ? '上传中...' : '更换头像' }}</span>
                        </div>
                    </div>
                    <input
                        ref="fileInput"
                        type="file"
                        accept="image/*"
                        style="display: none"
                        @change="handleFileChange"
                        :disabled="uploadLoading"
                    />
                </div>

                <!-- 信息列表 - 简化版 -->
                <div class="info-list">
                    <div class="info-row">
                        <div class="info-label">用户名</div>
                        <div class="info-content">
                            <span v-if="!editingFields.username">{{ userInfo.UserName }}</span>
                            <el-input 
                                v-else 
                                v-model="userInfo.UserName" 
                                size="small"
                                @blur="saveField('username')"
                            />
                        </div>
                        <el-button 
                            v-if="!editingFields.username" 
                            text 
                            @click="startEdit('username')"
                            class="edit-btn"
                        >
                            <el-icon><Edit /></el-icon>
                        </el-button>
                    </div>

                    <div class="info-row">
                        <div class="info-label">账号</div>
                        <div class="info-content">
                            <span v-if="!editingFields.account">{{ userInfo.Account }}</span>
                            <el-input 
                                v-else 
                                v-model="userInfo.Account" 
                                size="small"
                                @blur="saveField('account')"
                            />
                        </div>
                        <el-button 
                            v-if="!editingFields.account"
                            text 
                            @click="startEdit('account')"
                            class="edit-btn"
                        >
                            <el-icon><Edit /></el-icon>
                        </el-button>
                    </div>

                    <div class="info-row">
                        <div class="info-label">邮箱</div>
                        <div class="info-content">
                            <span v-if="!editingFields.email">{{ userInfo.Email }}</span>
                            <el-input 
                                v-else 
                                v-model="userInfo.Email" 
                                size="small"
                                @blur="saveField('email')"
                            />
                        </div>
                        <el-button 
                            v-if="!editingFields.email" 
                            text 
                            @click="startEdit('email')"
                            class="edit-btn"
                        >
                            <el-icon><Edit /></el-icon>
                        </el-button>
                    </div>

                    <div class="info-row">
                        <div class="info-label">性别</div>
                        <div class="info-content">
                            <el-radio-group v-model="userInfo.Gender" @change="saveField('gender')">
                                <el-radio :value="0">保密</el-radio>
                                <el-radio :value="1">男</el-radio>
                                <el-radio :value="2">女</el-radio>
                            </el-radio-group>
                        </div>
                    </div>

                    <div class="info-row">
                        <div class="info-label">注册时间</div>
                        <div class="info-content">
                            <span>{{ formatTime(userInfo.CreatedAt) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <el-button @click="handleClose">关闭</el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Close, Camera, Edit } from '@element-plus/icons-vue'
import { uploadAvatar, updateUserAccount } from '../api/auth/auth'

const emit = defineEmits(['close', 'update'])

const fileInput = ref(null)

const userInfo = reactive({
    Email: '',
    UserName: '',
    Account: '',
    Avatar: '',
    Gender: 0,
    CreatedAt: 0
})

const editingFields = reactive({
    username: false,
    email: false,
    account: false,
})

const loadUserInfo = () => {
    const userInfoStr = localStorage.getItem('userInfo')
    if (userInfoStr) {
        const data = JSON.parse(userInfoStr)
        Object.assign(userInfo, data)
    }
}

const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp * 1000)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const startEdit = (field) => {
    editingFields[field] = true
}

const saveField = (field) => {
    editingFields[field] = false
    if (field === 'username') {
        console.log('修改用户名:', userInfo.UserName)
        // TODO: 调用修改用户名接口
    } else if (field === 'email') {
        console.log('修改邮箱:', userInfo.Email)
        // TODO: 调用修改邮箱接口
    } else if (field === 'account') {
        console.log('修改账号:', userInfo.Account)
        updateUserAccount({ Account: userInfo.Account }).then(res => {
            if (res.data.code === '10000') {
                ElMessage.success('账号更新成功')
            } else {
                ElMessage.error(res.data.message || '账号更新失败')
            }
        })
    } else if (field === 'gender') {
        console.log('修改性别:', userInfo.Gender)
        // TODO: 调用修改性别接口
    }
    emit('update', userInfo)
}

const triggerUpload = () => {
    fileInput.value.click()
}

const uploadLoading = ref(false)
const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
        ElMessage.error('只能上传图片文件!')
        return
    }
    
    if (file.size / 1024 / 1024 > 5) {
        ElMessage.error('图片大小不能超过 5MB!')
        return
    }
    
    uploadLoading.value = true
    // 临时预览
    const reader = new FileReader()
    reader.onload = (e) => {
        userInfo.Avatar = e.target.result
    }
    reader.readAsDataURL(file)
    
    // 调用上传接口
    uploadAvatar(file).then(res => {
        if (res.data.code === '10000') {
            // 后端返回图片 URL，假设在 res.data.data.url
            userInfo.Avatar = res.data.data.AvatarUrl
            localStorage.setItem('userAvatar', res.data.data.AvatarUrl)
            emit('update', userInfo)
            ElMessage.success('头像更新成功')
            uploadLoading.value = false
        } else {
            ElMessage.error(res.data.message || '头像上传失败')
            uploadLoading.value = false
        }
    })
    event.target.value = ''
}

const handleClose = () => {
    emit('close')
}

onMounted(() => {
    loadUserInfo()
})
</script>

<style lang="scss" scoped>
.user-info-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    
    .modal-content {
        width: 500px;
        max-width: 90%;
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        
        .modal-header {
            padding: 20px 24px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #1a1a1a;
            }
            
            .close-icon {
                font-size: 18px;
                color: #999;
                cursor: pointer;
                
                &:hover {
                    color: #333;
                }
            }
        }
        
        .modal-body {
            padding: 24px;
            
            .avatar-section {
                display: flex;
                justify-content: center;
                margin-bottom: 28px;
                
                .avatar-wrapper {
                    position: relative;
                    cursor: pointer;
                    
                    .user-avatar {
                        border: 3px solid #fff;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    }
                    
                    .avatar-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: rgba(0, 0, 0, 0.6);
                        border-radius: 50%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        opacity: 0;
                        transition: opacity 0.25s;
                        color: white;
                        
                        .el-icon {
                            font-size: 20px;
                            margin-bottom: 4px;
                        }
                        
                        span {
                            font-size: 11px;
                        }
                    }
                    
                    &:hover .avatar-overlay {
                        opacity: 1;
                    }
                }
            }
            
            .info-list {
                .info-row {
                    display: flex;
                    align-items: center;
                    padding: 14px 0;
                    border-bottom: 1px solid #f5f5f5;
                    
                    &:last-child {
                        border-bottom: none;
                    }
                    
                    .info-label {
                        width: 70px;
                        font-size: 14px;
                        font-weight: 600;
                        color: #666;
                    }
                    
                    .info-content {
                        flex: 1;
                        margin-left: 16px;
                        
                        span {
                            font-size: 14px;
                            font-weight: 500;
                            color: #1a1a1a;
                        }
                        
                        .el-input {
                            max-width: 200px;
                        }
                        
                        .el-radio-group {
                            .el-radio {
                                margin-right: 16px;
                                
                                .el-radio__label {
                                    font-size: 13px;
                                }
                            }
                        }
                    }
                    
                    .edit-btn {
                        padding: 4px 8px;
                        color: #999;
                        
                        &:hover {
                            color: #4A90E2;
                        }
                    }
                }
            }
        }
        
        .modal-footer {
            padding: 16px 24px;
            border-top: 1px solid #f0f0f0;
            display: flex;
            justify-content: flex-end;
            
            .el-button {
                padding: 8px 20px;
            }
        }
    }
}
</style>