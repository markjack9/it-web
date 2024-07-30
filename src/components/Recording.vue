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
        <el-icon><Tickets /></el-icon>
        <template #title>系统日志</template>
      </el-menu-item>
      <el-menu-item @click="onswitchviewback(2)" index="2">
        <el-icon><AlarmClock /></el-icon>
        <template #title>报警日志</template>
      </el-menu-item>
      <el-menu-item @click="onswitchviewback(3)" index="3">
        <el-icon><document /></el-icon>
        <template #title>文件上传日志</template>
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
  Document,
 Tickets, AlarmClock,
} from '@element-plus/icons-vue'
import SystemLog from "../view/Recording/SystemLog.vue";
import AlarmLog from "../view/Recording/AlarmLog.vue";
import FileUploadLog from "../view/Recording/FileUploadLog.vue";


const isCollapse = ref(false)
const comId = shallowRef(SystemLog)
const onswitchviewback = (key:number) => {
  if (key === 1 ){
    comId.value = SystemLog
  } else if (key === 2 ) {
    comId.value = AlarmLog
  }else if (key === 3 ) {
    comId.value = FileUploadLog
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