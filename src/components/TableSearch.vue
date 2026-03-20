<template>
    <el-form :model="formData" ref="ruleFormRef">
        <el-row :gutter = "20">
            <template v-for = "item in formItemAttrs" :key = "item.prop">
                <el-col v-bind = "item.col">
                    <el-form-item :label="item.label" :prop = "item.prop">
                        <!--使用动态组件-->
                        <component v-model = "formData[item.prop]"  :is="isComp(item.comp)" :placeholder = "item.placeHolder">
                            <template v-if = "item.comp === 'select'">
                                <el-option label = "全部" value = ""/>
                                <el-option 
                                    v-for = "option in item.options" 
                                    :key = "option.value" 
                                    :label="option.label" 
                                    :value="option.value"/>
                            </template>   
                        </component>
                    </el-form-item>
                </el-col>
            </template>
        </el-row>
        <el-row>
            <el-button type="primary" @click = "handleSearch">查询</el-button>
            <el-button @click = "handleReset">重置</el-button>
        </el-row>
    </el-form>
</template>
<script setup>
import { Smoking } from '@element-plus/icons-vue';
import { el } from 'element-plus/es/locales.mjs';
import {ref,reactive,computed} from 'vue';

const props = defineProps({
    formItem: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['search'])

const formItemAttrs = computed(() => {
    const {formItem} = props
    formItem.forEach(item => {
        item.col = {
            xs : 24,
            sm : 12,
            md : 8,
            lg : 6,
            xl : 6
        }
        if (!(item.prop in formData)) {
            formData[item.prop] = ''
        }
    })
    return formItem
})

// 初始表单数据
const formData = reactive({})
const ruleFormRef = ref(null)

const isComp = (comp) => {
    return {
        input :"elInput",
        select :"elSelect"
    }[comp]
} 

const handleSearch = () => {
    emit('search', formData)
}
const handleReset = () => {
    // 先重置表单，再触发查询
    if (!ruleFormRef.value) return
    ruleFormRef.value.resetFields()
    emit('search', formData)
}
</script>