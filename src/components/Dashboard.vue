<template>
<div>
  <PublicHeader></PublicHeader>
</div>

    <div  class="left-rail">
      <el-menu
          default-active="0"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          @open="handleOpen"
          @close="handleClose"

      >
        <el-menu-item @click="onswitchviewback(1)" index="1">
          <el-icon><icon-menu /></el-icon>
          <template  #title>系统信息</template>
        </el-menu-item>
        <el-menu-item @click="onswitchviewback(2)" index="2">
          <el-icon><Grid /></el-icon>
          <template #title>主机列表</template>
        </el-menu-item>
        <el-menu-item @click="onswitchviewback(3)" index="3">
          <el-icon><document /></el-icon>
          <template #title>报警事件</template>
        </el-menu-item>

      </el-menu>
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
<style >


.g-context {
  margin: 30px 30px 30px 30px;
  top: 71px;
  left: 200px;
  position: absolute;
  display: flex;
  flex-direction: column;
 height: calc(100% - 71px);
  overflow: auto;
  width: calc(100% - 200px);
}
.left-rail{
  top: 71px;
  height: calc(100% - 71px);
  position: absolute;
  overflow: auto;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width:200px;
  min-height: 100%;
  height: auto;
}
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  width: 350px;

}
.demo-progress .el-progress--circle {
  margin-right: 15px;

}

</style>
<script lang="ts" setup>
import {onMounted, ref, shallowRef} from 'vue'
import PublicHeader from "./Header.vue"
import SystemView from "../view/Dashboard/System-View.vue";
import AlarmView from "../view/Dashboard/Alarm-View.vue";

import HostlistView from "../view/Dashboard/Hostlist-View.vue";

import {
  Document,
  Menu as IconMenu,
  Location,
  Setting, DataLine, Expand, Grid, Notebook,Minus, Plus,
} from '@element-plus/icons-vue'
const isCollapse = ref(false)

const comId = shallowRef(SystemView)


const onswitchviewback = (key:number) => {
  if (key === 1 ){
    comId.value = SystemView
  } else if (key === 2 ) {
    comId.value = HostlistView
  }else if (key === 3 ) {
    comId.value = AlarmView
  }
}
let ifcolapse:boolean = isCollapse.value
const leftif= () =>{
  if (ifcolapse == true) {
    console.log("隐藏左侧菜单栏")
  }
}
const handleOpen = (key: string, keyPath: string[]) => {
 console.log(key,keyPath)
}

const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)

}

</script>