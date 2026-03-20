<template>
    <el-aside :width = "isCollapse ? '64px' : '264px'">
      <el-menu
        :collapse = "isCollapse"
        :collapse-transition = "false"
         default-active="2"
         class = "sidebar-style"
      >
        <div class = "brand">
          <el-image style = "width:50px;height:50px;margin-right:10px;" :src="brandIconUrl" alt = "logo"/>
          <div v-show = "!isCollapse" class = "brand-info">
            <h1 class = "brand-title">InnerG</h1>
            <h2 class = "brand-subtitle">管理后台</h2>
          </div>

        </div>
        <el-menu-item @click = "selectMenu" v-for = "item in router.options.routes[0].children" :key="item.path" :index="item.path">
          <el-icon><component :is="item.meta.icon" /></el-icon>
          <span>{{ item.meta.title }}</span>
        </el-menu-item>

      </el-menu>
    </el-aside>  
</template>
<script setup> 
import { useAdminStore } from '../stores/admin';
import { computed } from 'vue';
import { Key } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const brandIconUrl = new URL('../assets/brand_icon.svg', import.meta.url).href;

const isCollapse = computed(() => useAdminStore().isCollapse);

const selectMenu = (Key) =>{
    const currentRoute = router.options.routes[0] 
    router.push(`${currentRoute.path}/${Key.index}`);
}

</script>

<style lang="scss" scoped>
.sidebar-style{
  height :100%;
  .brand{
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
  .brand-info{
    margin-left: 10px;
    .brand-title{
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }
    .brand-subtitle{
      font-size: 12px;
      color: #666;
    }
  }
}
}
</style>