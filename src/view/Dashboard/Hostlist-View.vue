<template>
<div class="host-statistics">
  <div>
    <div>
      <el-card class="host-card-statistic">
        <el-row :gutter="16">
          <el-col :span="8">
            <div class="statistic-card">
              <el-statistic :value="hosttotal">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    主机数量
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span>新增主机数量</span>
                  <span class="green">
              {{addhosttotal}}
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
              <el-statistic :value="hostonline">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    当前在线数量
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span>在线率</span>
                  <span class="green">
              {{ onlinerate }}%
              <el-icon>
                <CaretBottom/>
              </el-icon>
            </span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="statistic-card">
              <el-statistic :value="hostoffline" title="New transactions today">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    当前离线数量
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span>设备离线率</span>
                  <span class="red">
              {{offlinerate}}%
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
<el-card class="host-card">
  <el-table
      :data="tableData"
      style="width: 100%"
      class="host-card-list"
  >
    <el-table-column prop="hostid" label="序号" width="80" align="center" />
    <el-table-column prop="hostname" label="主机名" width="120" align="center" />
    <el-table-column prop="systemtype" label="系统版本" width="120" align="center" />
    <el-table-column prop="hoststatus" :formatter="statusicon" label="主机状态" width="120" align="center" />
    <el-table-column prop="hostip" label="主机IP" width="120" align="center" />
    <el-table-column prop="hostissues" label="问题" width="120" align="center" />
    <el-table-column prop="hostlocation" label="主机位置" width="120" align="center" />
    <el-table-column prop="hostowner" label="主机负责人" width="120" align="center" />
    <el-table-column prop="hostuptime" label="主机运行时间" width="120" align="center" />
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
hostid: number
  hostname: string
  systemtype: string
  hoststatus: boolean
  hostip: string
  hostissues: number
  hostlocation: string
  hostowner: string
  hostuptime: string
}
const hosttotal = ref(0)
const hostonline = ref(0)
const  hostoffline = ref(0)
const addhosttotal = ref(0)
const onlinerate = ref(0)
const offlinerate = ref(0)
onMounted(() => {
    hostlistdata()
  hoststatistics()

})
const statusicon = (row)=> {
      if (row.hoststatus === 1) {
        return '在线'
      } else  {
        return '离线'
      }
}
const hoststatistics = () => {

  axios.post('http://192.168.0.117:8081/statisticsdata', {
    statisticstype: "hosttotal",
  }).then(
      reponse => {
        hosttotal.value = reponse.data.data;
      },
      error => {
        console.log("请求数据失败了:", error.message)
      });
  axios.post('http://192.168.0.117:8081/statisticsdata', {
    statisticstype: "hostonline",
  }).then(
      reponse => {
        hostonline.value = reponse.data.data;
        hostoffline.value= hosttotal.value - hostonline.value
        onlinerate.value = Math.floor((hostonline.value / hosttotal.value) * 100)
        offlinerate.value = Math.floor((hostoffline.value / hosttotal.value) * 100)
      },
      error => {
        console.log("请求数据失败了:", error.message)
      });
  axios.post('http://192.168.0.117:8081/statisticsdata', {
    statisticstype: "hostaddtoday"
  }).then(
      reponse => {
        addhosttotal.value = reponse.data.data;
      },
      error => {
        console.log("请求数据失败了:", error.message)
      });
}
const tableData = ref<Hostinfo[]>([])
const hostlistdata = () => {
    axios.post('http://192.168.0.117:8081/hostlistdata', {
        typeoperation: "hostinit"
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
.host-statistics {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
}
.host-card {
  width: 90%;
  margin-top: 20px;
}
.host-card-statistic {
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