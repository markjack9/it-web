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
                    会议室总数
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span>新增数量</span>
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
                    <el-button @click="todayreadymeetroom = true;todaynotnullgetdate()">今日已巡检数量</el-button>
                    <el-dialog
                        v-model="todayreadymeetroom"
                        :before-close="closedialog"
                        :show-close="false"
                        title="今日已巡检会议室"
                    style="width: 350px">
                      <el-row :gutter="20">
                        <el-col v-for="(item, index) in todaynotnullstr" :key="index" :span="8">
                          <el-card class="box-card">
                            <div slot="header" class="clearfix">
                              <span>{{ item }}</span>
                            </div>
                          </el-card>
                        </el-col>
                      </el-row>
                    </el-dialog>
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span>已巡检占比</span>
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
                    <el-button @click="todaynotreadymeetroom = true;todaynullgetdate()">今日未巡检数量</el-button>
                    <el-dialog
                        v-model="todaynotreadymeetroom"
                        :before-close="closedialog"
                        :show-close="false"
                        title="今日未巡检会议室"
                        style="width: 350px">
                      <el-row :gutter="20">
                        <el-col v-for="(item, index) in todaynullstr" :key="index" :span="8">
                          <el-card class="box-card">
                            <div slot="header" class="clearfix">
                              <span>{{ item }}</span>
                            </div>
                          </el-card>
                        </el-col>
                      </el-row>
                    </el-dialog>
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span>未巡检占比</span>
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
  <el-button @click="userinfolist = true;userlistget()">人员对照表</el-button>
  <el-dialog
      v-model="userinfolist"
      :show-close="false"
      title="人员对照表">
    <el-table :data="userlistinfodate" style="width: 100%">
      <!-- 用户名列 -->
      <el-table-column prop="UserName" label="用户名" width="180">
      </el-table-column>

      <!-- 会议室列 -->
      <el-table-column prop="MeetRoom" label="会议室">
        <template v-slot="scope">
          <!-- 直接显示会议室列表 -->
          <span>{{ scope.row.MeetRoom }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  <el-table
      :data="tableData"
      style="width: auto"
      class="host-card-list"
  >
    <el-table-column prop="Number" label="序号" width="80" align="center" />
    <el-table-column prop="MeetRoom" label="会议室名称" width="200" align="center" />
    <el-table-column prop="MeetStatus" :formatter="statusicon" label="巡检状态" width="200" align="center" />
    <el-table-column prop="RoomIP" label="设备IP" width="200" align="center" />
    <el-table-column prop="MeetOwner" label="巡检人员" width="200" align="center" />
    <el-table-column prop="StartTime" label="巡检时间" width="200" align="center" />
    <el-table-column prop="Note" label="巡检记录" width="200" align="center" />
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
interface meetroomdate {
Number: number
  MeetRoom: string
  MeetStatus: string
 RoomIP: string
  MeetOwner: string
  StartTime: string
 Note: string
}
const userlistinfodate = ref([]);
const todaynotnullstr = ref([])
const todaynullstr = ref([])
const userinfolist = ref(false)
const todayreadymeetroom = ref(false)
const todaynotreadymeetroom = ref(false)
const hosttotal = ref(24)
const hostonline = ref(0)
const  hostoffline = ref(0)
const addhosttotal = ref(0)
const onlinerate = ref(0)
const offlinerate = ref(0)
onMounted(() => {
    hostlistdata()
  hoststatistics()

})

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const statusicon = (row)=> {
      if (row.MeetStatus === "正常") {
        return '正常'
      } else  {
        return '异常'
      }
}
const hoststatistics = () => {

  axios.get('http://192.168.8.116:8080/GetInspected').then(
      reponse => {
        hostonline.value = reponse.data.data;
        hostoffline.value = 24 - hostonline.value
        onlinerate.value = Math.round((hostonline.value / 24) * 100)
        offlinerate.value = Math.round((hostoffline.value / 24) * 100)
      },
      error => {
        console.log("请求数据失败了:", error.message)
      });

}
const tableData = ref<meetroomdate[]>([])
const hostlistdata = () => {
    axios.get('http://192.168.8.116:8080/Date').then(
        reponse => {
            console.log("请求数据成功")
            tableData.value = reponse.data.data;

        },
        error => {
            console.log("请求数据失败了:", error.message)
        });
}
const userlistget = () => {
  axios.get('http://192.168.8.116:8080/GetUserInfo').then(
      reponse => {
        console.log("请求数据成功")
        userlistinfodate.value = reponse.data.data;

      },
      error => {
        console.log("请求数据失败了:", error.message)
      });
}
const todaynullgetdate = () => {
  axios.post('http://192.168.8.116:8080/GetTodayMeetroom', {
    option: "todaynull",
  }).then(
      reponse => {
        console.log("请求数据成功")
        todaynullstr.value = reponse.data.data.flat();
      },
      error => {
        console.log("请求数据失败了:", error.message)
      });
}
const todaynotnullgetdate = () => {
  axios.post('http://192.168.8.116:8080/GetTodayMeetroom', {
    option: "today",
  }).then(
      reponse => {
        console.log("请求数据成功")
        todaynotnullstr.value = reponse.data.data.flat();
      },
      error => {
        console.log("请求数据失败了:", error.message)
      });
}
// 数据处理函数
const processData = (data) => {
  // 假设这里我们对数据进行分组，每3项一组
  const groupSize = 3;
  const groupedData = [];

  for (let i = 0; i < data.length; i += groupSize) {
    groupedData.push(data.slice(i, i + groupSize));
  }

  return groupedData;
};

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