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
          <el-button @click="toggleSelection()">取消勾选</el-button>
          <el-button @click="alarmsettingdata()">刷新</el-button>
          <el-button @click="openitem()">查看</el-button>
          <el-dialog
              v-model="todoeseeitem"
              :before-close="closedialog"
              :show-close="false"
              title="主机信息">
            <el-form :model="addform" label-width="120px">
              <el-form-item label="主机名">
                <el-input v-model="addform.alarmhostname" disabled/>
              </el-form-item>
              <el-form-item label="报警类型">
                <el-select v-model="addform.alarmtype" disabled>
                  <el-option label="服务问题" value="1000"/>
                  <el-option label="系统问题" value="1001"/>
                  <el-option label="网络问题" value="1002"/>
                  <el-option label="硬件问题" value="1003"/>
                </el-select>
              </el-form-item>
              <el-form-item label="报警状态">
                <el-switch v-model="hoststatus" disabled/>
              </el-form-item>
              <el-form-item label="报警处理人员">
                <el-input v-model="addform.alarmhostonwer" disabled/>
              </el-form-item>
              <el-form-item>
                <el-button @click="todoeseeitem = false;toggleSelection()">关闭</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
          <el-button @click="edititem()">编辑</el-button>
          <el-dialog
              v-model="todoedititem"
              :before-close="closedialog"
              :show-close="false"
              title="编辑主机信息">
            <el-form :model="addform" label-width="120px">
              <el-form-item label="主机名">
                <el-input v-model="addform.alarmhostname" placeholder=""/>
              </el-form-item>
              <el-form-item label="报警类型">
                <el-checkbox-group  v-model="alarmtype" @change="alarmtypeoptionchange">
                  <el-checkbox
                  v-for="item in alarmtypeoption"
                  :key="item.alarmtypeid"
                  :label="item.alarmtypeid"
                  >
                    {{item.alarmtypename}}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="报警状态">
                <el-switch v-model="hoststatus" @click="clickhoststatus"/>
              </el-form-item>

              <el-form-item label="报警处理人员">
                <el-input v-model="addform.alarmhostonwer" placeholder=""/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="todoedititem = false;todoalarmlist('change')">确定
                </el-button>
                <el-button @click="todoedititem = false;toggleSelection()">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
          <el-table
              ref="multipleTableRef"
              :data="tableData"
              style="width: 100%"
              class="alarm-card-list"
              @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="60" />
            <el-table-column prop="alarmid" label="序号" width="80" align="center"/>
            <el-table-column prop="alarmhostname" label="主机名" width="120" align="center"/>
            <el-table-column prop="alarmtype" :formatter="alarmtypestring" align="center"  label="报警类型" width="120" class-name="alarmtypestr"/>
            <el-table-column prop="alarmstatus" :formatter="statusicon" align="center" label="报警状态" width="120" />
            <el-table-column prop="alarmhostonwer" label="负责人" width="120" align="center" />
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
  ElIcon, ElMessage, ElMessageBox,
} from 'element-plus'

import {onMounted, reactive, ref} from 'vue'
import { ElTable } from 'element-plus'
import axios from 'axios';
interface alarminfo {
  alarmid: string
  alarmhostname: string
  alarmtype: number
  alarmstatus: number
  alarmalarmip: string
  alarmissues: number
  alarmhostonwer: string
  alarmstarttime: string
}
let form: alarminfo
const alarmtodaytotal = ref(0)
const alarmofflinetoday = ref(0)
const alarmaddtodayonline= ref(0)
const alarmtotal = ref(0)
const alarmonline = ref(0)
const  alarmoffline = ref(0)
const onlinerate = ref(0)
const offlinerate = ref(0)
const hoststatus = ref(true)
const tableData = ref<alarminfo[]>([])
const todoadditem = ref(false)
const todoedititem = ref(false)
const todoeseeitem = ref(false)
const isselect = ref(false)
const closedialog = (done) => {
  toggleSelection()
  done();
}
const clickhoststatus = () => {
  if (form.alarmstatus === 1 ) {
    addform.alarmstatus = 0
    console.log(form.alarmstatus)
  } else if (form.alarmstatus === 0 ) {
    addform.alarmstatus = 1
  }

}
const addform = reactive({
  alarmid: "",
  alarmhostname: "",
  alarmtype: 0,
  alarmstatus: 1,
  alarmhostonwer: "",
})
const alarmtype = ref([])
const alarmtypeoption = [
  {
    alarmtypeid: 1000,
    alarmtypename: '应用服务类',
  },
  {
    alarmtypeid: 1001,
    alarmtypename: '系统类',
  },
  {
    alarmtypeid: 1004,
    alarmtypename: '网络类',
  },
  {
    alarmtypeid: 1006,
    alarmtypename: '硬件类',
  }
]
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<alarminfo[]>([])
const toggleSelection = (rows?: alarminfo[]) => {
  if (rows) {
    multipleTableRef.value!.toggleAllSelection()
  } else {
    multipleTableRef.value!.clearSelection()
    isselect.value = false
    hoststatus.value = false

  }
}
let optionstr = 0
const alarmtypeoptionchange = () => {
optionstr = 0
  for (let  i of alarmtype.value){
    optionstr= optionstr +i
  }
}
const handleSelectionChange = (val: alarminfo[]) => {
  multipleSelection.value = val
  form = val[0]
  isselect.value = true
  addform.alarmid = form.alarmid
  addform.alarmhostname = form.alarmhostname
  addform.alarmtype = form.alarmtype
  addform.alarmhostonwer = form.alarmhostonwer
  if (form.alarmstatus === 0){
    hoststatus.value = false
  }else if (form.alarmstatus === 1) {
    hoststatus.value = true
  }
}
const edititem = () => {
  if (isselect.value === false) {
    Selectnoti()
  } else {
    todoedititem.value = true
  }
}
const openitem = () => {
  if (isselect.value === false) {
    Selectnoti()
  } else {
    todoeseeitem.value = true
  }

}

const Selectnoti = () => {
  ElMessageBox.alert('请选择操作的主机', '提示', {
    confirmButtonText: '好的',
  })
}


const statusicon = (row)=> {
  if (row.alarmstatus === 1) {
    return '开启'
  } else  {
    return '关闭'
  }
}

const alarmtypestring= (row)=>{
  if (row.alarmtype === 4011) {
    return '所有报警'
  } else  if (row.alarmtype === 1000 ){
    return '应用服务类'
  }else  if (row.alarmtype === 1004){
    return '网络类'
  } else  if (row.alarmtype === 1001){
    return '系统服务类'
  }else  if (row.alarmtype === 1006){
    return '硬件类'
  }else  if (row.alarmtype === 2006){
    return '硬件类\n应用服务类'
  }else  if (row.alarmtype === 2007){
    return '硬件类\n系统类'
  }else  if (row.alarmtype === 2010){
    return '硬件类\n网络类'
  }else  if (row.alarmtype === 2005){
    return '网络类\n系统类'
  }else  if (row.alarmtype === 2004){
    return '网络类\n应用服务类'
  }else  if (row.alarmtype === 2001){
    return '系统类\n应用服务类'
  }else  if (row.alarmtype === 3005){
    return '系统类\n应用服务类\n网络类'
  }else  if (row.alarmtype === 3010){
    return '系统类\n网络类\n硬件类'
  }else  if (row.alarmtype === 3007){
    return '系统类\n应用服务类\n硬件类'
  }else  if (row.alarmtype === 3011){
    return '系统类\n网络类\n硬件类'
  }else  if (row.alarmtype === 0){
    return '未设置报警'
  }
}
onMounted(() => {
  alarmsettingdata()
  alarmstatistics()
})
const todoalarmlist = (option: string) => {
  if (option == 'change') {
console.log(addform)
    axios.post('http://192.168.0.117:8081/alarmsetting', {
      alarmoption: "alarmedit",
      alarmlist: {
        alarmhostname: addform.alarmhostname,
        alarmtype: optionstr,
        alarmstatus: addform.alarmstatus,
        alarmhostonwer: addform.alarmhostonwer,
        alarmid:addform.alarmid,
      }
    }).then((res) => {
      if (res.data.code === 1000) {
        console.log('success')
        alarmsettingdata()
        toggleSelection()
        alarmstatistics()
      } else {
        console.log(res.data)
      }

    }).catch(function (error) {
      console.log("错误信息", error)
    });
  }

}
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
}
const alarmsettingdata = () => {
  axios.post('http://192.168.0.117:8081/statisticsdata', {
    statisticstype: "alarminit"
  }).then(
      reponse => {
        console.log("请求数据成功")
        tableData.value = reponse.data.data;
      },
      error => {
        console.log("请求数据失败了:", error.message)
      });
  toggleSelection()
  alarmstatistics()}
</script>

<style scoped>

.el-table /deep/ .alarmtypestr>.cell{
  white-space: pre-wrap;
}
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