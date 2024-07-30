<template>
  <div class="alarm-statistics">
    <div>
      <div>
        <el-card class="alarm-card-statistic">
          <el-row :gutter="16">
            <el-col :span="8">
              <div class="statistic-card">
                <el-statistic :value="alarmtotal">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      报警数量总计
                    </div>
                  </template>
                </el-statistic>
                <div class="statistic-footer">
                  <div class="footer-item">
                    <span>增加数量</span>
                    <span class="red">
              {{ alarmtodaytotal }}
              <el-icon>
                <CaretTop />
              </el-icon>
            </span>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="statistic-card">
                <el-statistic :value="alarmonline">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      正在进行的报警
                    </div>
                  </template>
                </el-statistic>
                <div class="statistic-footer">
                  <div class="footer-item">
                    <span>今日新增报警</span>
                    <span class="red">
              {{alarmaddtodayonline}}
              <el-icon>
                <CaretTop/>
              </el-icon>
            </span>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="statistic-card">
                <el-statistic :value="alarmoffline" title="New transactions today">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      已处理报警数量
                    </div>
                  </template>
                </el-statistic>
                <div class="statistic-footer">
                  <div class="footer-item">
                    <span>新增已处理报警</span>
                    <span class="green">
              {{alarmofflinetoday}}
              <el-icon>
                <CaretTop/>
              </el-icon>
            </span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <div>
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
            <el-table-column prop="alarmhostonwer" label="管理员" width="120" align="center" />
          </el-table>
        </el-card>
      </div>
    </div>

  </div>



</template>

<script lang="ts" setup>
import {
  CaretBottom,
  CaretTop,
} from '@element-plus/icons-vue'
import {
  ElIcon,
} from 'element-plus'

import {onMounted, ref} from 'vue'
import { ElTable } from 'element-plus'
import axios from 'axios';
interface Hostinfo {
  alarmid: number
  alarmhostname: string
  alarmtype: string
  alarmhoststatus: boolean
  alarmhostip: string
  alarminfo: number
  alarmhostlocation: string
  alarmhostonwer: string
  alarmstarttime: string
}
onMounted(() => {
  alarmstatistics()
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
const alarmstatistics = () => {

  axios.post('http://192.168.0.117:8081/statisticsdata', {
    statisticstype: "alarmtotal",
  }).then(
      reponse => {
        alarmtotal.value = reponse.data.data;
      },
      error => {
        console.log("请求数据失败了:", error.message)
      });
  axios.post('http://192.168.0.117:8081/statisticsdata', {
    statisticstype: "alarmonline",
  }).then(
      reponse => {
        alarmonline.value = reponse.data.data;
        alarmoffline.value= alarmtotal.value - alarmonline.value
      },
      error => {
        console.log("请求数据失败了:", error.message)
      });
  axios.post('http://192.168.0.117:8081/statisticsdata', {
    statisticstype: "alarmtodaytotal"
  }).then(
      reponse => {
        alarmtodaytotal.value = reponse.data.data;
      },
      error => {
        console.log("请求数据失败了:", error.message)
      });
  axios.post('http://192.168.0.117:8081/statisticsdata', {
    statisticstype: "alarmaddtoday"
  }).then(
      reponse => {
        alarmaddtodayonline.value = reponse.data.data;
        alarmofflinetoday.value = alarmtodaytotal.value - alarmaddtodayonline.value
      },
      error => {
        console.log("请求数据失败了:", error.message)
      });
  axios.post('http://192.168.0.117:8081/statisticsdata', {
    statisticstype: "alarmonlineinit"
  }).then(
      reponse => {
        console.log("请求数据成功")
        tableData.value = reponse.data.data;
      },
      error => {
        console.log("请求数据失败了:", error.message)
      });
}

</script>

<style scoped>
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}
.alarm-statistics {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
}
.alarm-card {
  width: 90%;
  margin-top: 20px;
}
.alarm-card-statistic {
  width: 90%;
}
.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}
.red {
  color: var(--el-color-error);
}
</style>