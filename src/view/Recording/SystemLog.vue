<template>
  <div class="logsetting">
    <div>
      <el-card class="log-card-statistic">
        <el-text class="log-text">系统日志</el-text>
        <el-card class="systemlog-card">
          <el-table
              :data="tableData"
              style="width: 100%"
              class="host-card-list"
          >
            <el-table-column prop="systemlogid" label="事件id" width="80" align="center" />
            <el-table-column prop="systemlogtype" label="操作" width="120" align="center" />
            <el-table-column prop="systemloginfo" label="操作内容" width="120" align="center" show-overflow-tooltip />
            <el-table-column prop="systemloghostname" label="影响主机" width="120" align="center" />
            <el-table-column prop="systemlognote" label="处理结果" width="120" show-overflow-tooltip />
            <el-table-column prop="systemlogstarttime" label="发生时间" width="120" />
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
  systemlogid: number
  systemloghostname: string
  systemlogtype: string
  systemloghostip: string
  systemloginfo: string
  systemlogstarttime: string
}
const systemloglog= () => {
  axios.post('http://192.168.0.117:8081/crontab', {
    parameoption: "logmsgsystem",
  }).then(
      reponse => {
        tableData.value = reponse.data.data;
      },
      error => {
        console.log("请求数据失败了:", error.message)
      });
}
onMounted(() => {
  systemloglog()
})
const tableData = ref<Hostinfo[]>([])
const systemlogtodaytotal = ref(0)
const systemlogofflinetoday = ref(0)
const systemlogaddtodayonline= ref(0)
const systemlogtotal = ref(0)
const systemlogonline = ref(0)
const  systemlogoffline = ref(0)
</script>

<style scoped>
.preclass{
  font-size: 14px;
  font-family: initial;
}
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