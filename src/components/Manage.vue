<template>
  <PublicHeader></PublicHeader>
  <div class="left-rail">
    <el-menu
        default-active="0"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        @open="handleOpen"
        @close="handleClose"
    >
      <el-menu-item @click="onswitchviewback(1)" index="1">
        <el-icon><CreditCard /></el-icon>
        <template #title>ssh远程工具</template>
      </el-menu-item>
      <el-menu-item @click="onswitchviewback(2)" index="2">
        <el-icon><Files /></el-icon>
        <template #title>文件管理</template>
      </el-menu-item>
      <el-menu-item @click="onswitchviewback(3)" index="3">
        <el-icon><Files/></el-icon>
        <template #title>日志管理</template>
      </el-menu-item>
    </el-menu>
    <el-radio-group v-model="isCollapse">
    </el-radio-group>
    <el-switch
        v-model="isCollapse"
        class="ml-2"
        style="--el-switch-on-color: #ff4949; --el-switch-off-color:#13ce66 "
    />
  </div>
  <div class="g-context">
    <component :is="comId"></component>
  </div>
</template>

<script lang="ts" setup>
import {ref, shallowRef} from 'vue'
import PublicHeader from "./Header.vue"
import {
  Monitor, CreditCard, Files,
} from '@element-plus/icons-vue'
import SshTool from "../view/Manage/SshTool.vue";
import WinTool from "../view/Manage/WinTool.vue";
import FileManage from "../view/Manage/FileManage.vue";
import LogManage from "../view/Manage/LogManage.vue";
const isCollapse = ref(false)
const comId = shallowRef(SshTool)
const onswitchviewback = (key:number) => {
  if (key === 1 ){
    comId.value = SshTool
  } else if (key === 2 ) {
    comId.value = FileManage
  }else if (key === 3 ) {
    comId.value = LogManage
  }
}
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style scoped>

</style>