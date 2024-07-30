<template>
  <div class="logsetting">
    <div>
      <el-card class="log-card-statistic">
        <el-text class="log-text">报警日志</el-text>
        <el-card class="alarm-card">
          <el-table
              :data="tableData"
              style="width: 100%"
              class="host-card-list"
          >
            <el-table-column prop="alarmid" label="报警id" width="80" align="center" />
            <el-table-column prop="alarmhostname" label="主机名" width="120" align="center" />
            <el-table-column prop="alarmtype" :formatter="alarmtypestring" label="报警类型" width="120" align="center" />
            <el-table-column prop="alarmhostip" label="主机IP" width="120" align="center" />
            <el-table-column prop="alarminfo" label="问题" width="120" />
            <el-table-column prop="alarmstarttime" label="报警时间" width="120" />
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
  alarmid: number
  alarmhostname: string
  alarmtype: string
  alarmhoststatus: boolean
  alarmhostip: string
  alarminfo: number
  alarmhostlocation: string
  alarmstarttime: string
}
const alarmlog= () => {
  axios.post('http://192.168.0.117:8081/crontab', {
    parameoption: "logmsgget",
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
const alarmtypestring= (row)=>{
  if (row.alarmtype === 4011) {
    return '所有报警'
  } else  if (row.alarmtype === 1000 ){
    return '应用服务类'
  }else  if (row.alarmtype === 1004){
    return '网络类'
  } else  if (row.alarmtype === 1001){
    return '系统服务类'
  }else  if (row.alarmtype === 1006) {
    return '硬件类'
  }
}
const tableData = ref<Hostinfo[]>([])
const alarmtodaytotal = ref(0)
const alarmofflinetoday = ref(0)
const alarmaddtodayonline= ref(0)
const alarmtotal = ref(0)
const alarmonline = ref(0)
const  alarmoffline = ref(0)
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