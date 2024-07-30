<template>
  <div class="logsetting">
    <div>
      <el-card class="log-card-statistic">
        <el-text class="log-text">文件日志</el-text>
        <el-card class="alarm-card">
          <el-table
              :data="tableData"
              style="width: 100%"
              class="host-card-list"
          >
            <el-table-column prop="fileid" label="文件id" width="80" align="center" />
            <el-table-column prop="filename" label="文件名称" width="120" align="center" />
            <el-table-column prop="fileoption" label="操作类型" width="120" align="center" />
            <el-table-column prop="fileinfo" label="操作结果" width="120" />
            <el-table-column prop="optiontime" label="操作时间" width="120" />
          </el-table>
        </el-card>

      </el-card>

    </div>
    <div></div>
  </div>
</template>

<script lang="ts" setup>


import {onMounted, ref} from "vue";
import axios from "axios";


interface Hostinfo {
 fileid: number
  filename: string
  fileoption: string
  fileinfo: string
  optiontime: string
}
const alarmlog= () => {
  axios.post('http://192.168.0.117:8081/crontab', {
    parameoption: "logoption",
  }).then(
      reponse => {
        tableData.value = reponse.data.data;
      },
      error => {
        console.log("请求数据失败了:", error.message)
      });
}
onMounted(() => {
  alarmlog()
})
const tableData = ref<Hostinfo[]>([])
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