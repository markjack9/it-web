<template>
<div class="logsetting">
  <div>
 <el-card class="log-card-statistic">
   <el-text class="log-text">日志管理</el-text>
   <el-card>
     <el-button @click="cleanlog('systemlogclean')" type="danger" plain>
       <el-icon><Delete /></el-icon>
       系统日志</el-button>
     <el-button @click="cleanlog('uploadlogclean')" type="danger" plain>
       <el-icon><Delete /></el-icon>
       文件上传日志</el-button>
     <el-button @click="cleanlog('tasklogclean')" type="danger" plain>
       <el-icon><Delete /></el-icon>
       定时任务日志</el-button>
     <el-button @click="cleanlog('alarmlogclean')" type="danger" plain>
       <el-icon><Delete /></el-icon>
       报警日志</el-button>
   </el-card>
 </el-card>
  </div>
</div>
</template>

<script lang="ts" setup>

import {Delete} from "@element-plus/icons-vue";
import axios from "axios";
const cleanlog = (option:string) =>{
  axios.post('http://192.168.0.117:8081/crontab', {
    parameoption: option
  }).then(
      reponse => {
        console.log("数据清空成功")
      });
}
</script>

<style scoped>
.log-text{
  font-size: 20px;
  font-weight: bolder;
}
.logsetting {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
}
.log-card-statistic {
  width: 90%;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  overflow: auto;
}
</style>