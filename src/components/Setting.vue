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
      <el-menu-item  @click="onswitchviewback(1)" index="1">
        <el-icon><Expand /></el-icon>
        <template #title>主机设置</template>
      </el-menu-item>
      <el-menu-item  @click="onswitchviewback(2)" index="2">
        <el-icon><icon-menu /></el-icon>
        <template #title>主机报警设置</template>
      </el-menu-item>
      <el-menu-item  @click="onswitchviewback(3)" index="3">
        <el-icon><setting /></el-icon>
        <template #title>报警设置</template>
      </el-menu-item>
      <el-menu-item  @click="onswitchviewback(4)" index="4">
        <el-icon><DataLine /></el-icon>
        <template #title>定时任务</template>
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
  Menu as IconMenu,
  Location,
  Setting, DataLine, Expand,
} from '@element-plus/icons-vue'
import HostSetting from "../view/Setting/HostSetting.vue";
import ALarmSetting from "../view/Setting/ALarmSetting.vue";
import NotificationSettings from "../view/Setting/NotificationSettings.vue";
import TimedTasks from "../view/Setting/TimedTasks.vue";
const isCollapse = ref(false)

const comId = shallowRef(HostSetting)
const onswitchviewback = (key:number) => {
  if (key === 1 ){
    comId.value = HostSetting
  } else if (key === 2 ) {
    comId.value = ALarmSetting
  }else if (key === 3 ) {
    comId.value = NotificationSettings
  }else if (key === 4 ) {
    comId.value = TimedTasks
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