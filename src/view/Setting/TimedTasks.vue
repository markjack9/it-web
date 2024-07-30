<template>
  <div class="job-statistics">
    <div>
      <div>
        <el-card class="job-card-statistic">
          <el-row :gutter="16">
            <el-col :span="8">
              <div class="statistic-card">
                <el-statistic :value="jobtotal">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      任务数量
                    </div>
                  </template>
                </el-statistic>
                <div class="statistic-footer">
                  <div class="footer-item">
                    <span>新增任务数量</span>
                    <span class="green">
              {{addjobtotal}}
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
                <el-statistic :value="jobonline">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      当前任务在线数量
                    </div>
                  </template>
                </el-statistic>
                <div class="statistic-footer">
                  <div class="footer-item">
                    <span>任务在线率</span>
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
                <el-statistic :value="joboffline" title="New transactions today">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      当前任务离线数量
                    </div>
                  </template>
                </el-statistic>
                <div class="statistic-footer">
                  <div class="footer-item">
                    <span>任务离线率</span>
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
        <el-card class="job-card">
          <el-button @click="toggleSelection(tableData)">全选</el-button>
          <el-button @click="toggleSelection()">取消勾选</el-button>
          <el-button @click="stopitem()">停止任务</el-button>
          <el-button @click="delitem">删除</el-button>
          <el-button @click="jobsettingdata()">刷新</el-button>
          <el-button @click="openitem()">查看</el-button>
          <el-dialog
              v-model="todoeseeitem"
              :before-close="closedialog"
              :show-close="false"
              title="任务信息">
            <el-form :model="addform" label-width="120px">
              <el-form-item label="任务名">
                <el-input v-model="addform.jobname" disabled/>
              </el-form-item>
              <el-form-item label="添加时间">
                <el-col :span="11">
                  <el-date-picker
                      v-model="addform.jobstarttime"
                      type="date"
                      placeholder=""
                      style="width: 100%"
                      disabled
                  />
                </el-col>
              </el-form-item>
              <el-form-item label="任务状态">
                <el-switch v-model="jobstatus" disabled/>
              </el-form-item>
              <el-form-item label="任务shell">
                <el-input v-model="addform.jobshell" type="textarea" disabled/>
              </el-form-item>
              <el-form-item label="crond表达式">
                <el-input v-model="addform.jobcronexpr" type="textarea" placeholder="" disabled/>
              </el-form-item>
              <el-form-item>
                <el-button @click="todoeseeitem = false;toggleSelection()">关闭</el-button>
              </el-form-item>
              <el-table
                  :data="jobdatatable"
                  style="width: 100%"
                  class="job-card-list"
              >
                <el-table-column prop="jobstarttime" align="center" label="开始时间" width="120"/>
                <el-table-column prop="jobstoptime" align="center"  label="结束时间" width="120"/>
                <el-table-column prop="jobrunning" align="center"  label="持续时间" width="120"/>
                <el-table-column prop="jobinfo" align="center"  label="任务输出" width="120" show-overflow-tooltip />
                <el-table-column prop="joberr" align="center"  label="错误日志" width="120" show-overflow-tooltip />
              </el-table>
            </el-form>
          </el-dialog>
          <el-button @click="todoadditem = true">添加</el-button>
          <el-dialog
              v-model="todoadditem"
              :before-close="closedialog"
              :show-close="false"
              title="任务信息">
            <el-form :model="seeform" label-width="120px">
              <el-form-item label="任务名称">
                <el-input v-model="seeform.jobname" placeholder="请填写任务名称"/>
              </el-form-item>
              <el-form-item label="添加时间">
                <el-col :span="11">
                  <el-date-picker
                      v-model="seeform.jobstarttime"
                      type="date"
                      format="YYYY/MM/DD"
                      value-format="x"
                      placeholder="添加任务时间"
                      style="width: 100%"
                  />
                </el-col>
              </el-form-item>
              <el-form-item label="任务状态">
                <el-switch v-model="seeform.jobstatus"/>
              </el-form-item>
              <el-form-item label="任务shell">
                <el-input v-model="seeform.jobshell" type="textarea" placeholder="备注说明"/>
              </el-form-item>
              <el-form-item label="crond表达式">
                <el-input v-model="seeform.jobcronexpr" type="textarea" placeholder=""/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="todoadditem = false;todojoblist('add')">确定
                </el-button>
                <el-button @click="todoadditem = false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
          <el-button @click="edititem()">编辑</el-button>
          <el-dialog
              v-model="todoedititem"
              :before-close="closedialog"
              :show-close="false"
              title="编辑任务信息">
            <el-form :model="addform" label-width="120px">
              <el-form-item label="任务名">
                <el-input v-model="addform.jobname" placeholder=""/>
              </el-form-item>
              <el-form-item label="添加时间" >
                <el-col :span="11">
                  <el-date-picker
                      v-model="addform.jobstarttime"
                      type="date"
                      placeholder=""
                      style="width: 100%"
                      disabled
                  />
                </el-col>
              </el-form-item>
              <el-form-item label="任务状态">
                <el-switch v-model="jobstatus" @click="clickjobstatus"/>
              </el-form-item>
              <el-form-item label="任务shell">
                <el-input v-model="addform.jobshell" type="textarea" placeholder=""/>
              </el-form-item>
              <el-form-item label="crond表达式">
                <el-input v-model="addform.jobcronexpr" type="textarea" placeholder=""/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="todoedititem = false;todojoblist('change')">确定
                </el-button>
                <el-button @click="todoedititem = false;toggleSelection()">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
          <el-table
              ref="multipleTableRef"
              :data="tableData"
              style="width: 100%"
              class="job-card-list"
              @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"/>
            <el-table-column label="序号" width="120">
              <template #default="scope">{{ scope.row.jobid }}</template>
            </el-table-column>
            <el-table-column prop="jobname" align="center" label="任务名" width="120"/>
            <el-table-column prop="jobstatus" align="center"  :formatter="statusicon" label="任务状态" width="120"/>
            <el-table-column prop="jobcronexpr" align="center"  label="crond表达式" width="120"/>
            <el-table-column prop="jobstarttime" align="center"  label="添加时间" width="120"/>
          </el-table>
        </el-card>
      </div>
    </div>

  </div>


</template>

<script lang="ts" setup>
import {CaretBottom, CaretTop,} from '@element-plus/icons-vue'
import {ElIcon, ElMessage, ElMessageBox, ElTable,} from 'element-plus'
import {onMounted, reactive, ref} from 'vue'
import axios from 'axios';

interface jobdatainfo {
  jobstarttime: string
  jobstoptime: string
  jobrunning: string
  jobinfo: string
  joberr: string
}

interface jobinfo {
  jobid: number
  jobname: string
  jobstatus: number
  jobstarttime: string
  jobcronexpr: string
  jobshell: string
}
const jobdatatable = ref<jobdatainfo[]>([])
let form: jobinfo
const jobtotal = ref(0)
const jobonline = ref(0)
const  joboffline = ref(0)
const addjobtotal = ref(0)
const onlinerate = ref(0)
const offlinerate = ref(0)
const jobstatus = ref(true)
const tableData = ref<jobinfo[]>([])
const todoadditem = ref(false)
const todoedititem = ref(false)
const todoeseeitem = ref(false)
const isselect = ref(false)
const closedialog = (done) => {
  toggleSelection()
  done();
}
const clickjobstatus = () => {
  if (form.jobstatus === 1 ) {
    addform.jobstatus = 0
  } else if (form.jobstatus === 0 ) {
    addform.jobstatus = 1
  }

}
const seeform =  reactive({
  jobid: "",
  jobname: "",
  jobstatus: 0,
  jobcronexpr: "",
  jobstarttime: "",
  jobshell: "",
})
const addform = reactive({
  jobid: "",
  jobname: "",
  jobstatus: 0,
  jobcronexpr: "",
  jobstarttime: "",
  jobshell: "",
})
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<jobinfo[]>([])
const toggleSelection = (rows?: jobinfo[]) => {
  if (rows) {
    multipleTableRef.value!.toggleAllSelection()
  } else {
    multipleTableRef.value!.clearSelection()
    isselect.value = false
    jobstatus.value = false

  }
}
const handleSelectionChange = (val: jobinfo[]) => {
  multipleSelection.value = val
  form = val[0]
  isselect.value = true
  addform.jobname = form.jobname
  addform.jobstarttime = form.jobstarttime
  addform.jobid = String(form.jobid)
  addform.jobshell= form.jobshell
  addform.jobcronexpr= form.jobcronexpr
  if (form.jobstatus === 0){
    jobstatus.value = false
  }else if (form.jobstatus === 1) {
    jobstatus.value = true
  }
}
const edititem = () => {
  if (isselect.value === false) {
    Selectnoti()
  } else {
    todoedititem.value = true
  }
}
const delitem = () => {
  if (isselect.value === false) {
    Selectnoti()
  } else {
    todojoblist('del')
  }
}
const stopitem = () => {
  if (isselect.value === false) {
    Selectnoti()
  } else {
    todojoblist('kill')
  }
}
const openitem = () => {
  if (isselect.value === false) {
    Selectnoti()
  } else {
    todoeseeitem.value = true
    todojoblist('selectjob')
  }

}

const Selectnoti = () => {
  ElMessageBox.alert('请选择操作的任务', '提示', {
    confirmButtonText: '好的',
  })
}
const DeleteNoti = () => {
  ElMessageBox.confirm(
      '您确认删除此条记录吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        console.log("删除数据",form.jobid)
        axios.post('http://192.168.0.117:8081/crontab', {
          parameoption: "del",
          crontabjob: {
            jobid: Number(form.jobid),
          },
          job: {
            name: form.jobname,
          }
        }).then((res) => {
          if (res.data.code === 1000) {
            console.log('success')
            toggleSelection()
            jobsettingdata()
            jobstatistics()
          } else {
            console.log(res.data.message)
          }

        }).catch(function (error) {
          console.log("错误信息", error)
        });

      })
}
const statusicon = (row)=> {
  if (row.jobstatus === 1) {
    return '在线'
  } else  {
    return '离线'
  }
}
onMounted(() => {
  jobsettingdata()
  jobstatistics()
})
const todojoblist = (option: string) => {

  if (option == 'del') {
    DeleteNoti()
  } else if (option == 'add') {
    if (seeform.jobstatus === true) {
      seeform.jobstatus = 1
    } else {
      seeform.jobstatus = 0
    }
    axios.post('http://192.168.0.117:8081/crontab', {
      parameoption: "add",
      crontabjob: {
        jobname: seeform.jobname,
        jobstatus: seeform.jobstatus,
        jobstarttime: String(seeform.jobstarttime),
        jobshell: seeform.jobshell,
        jobcronexpr: seeform.jobcronexpr,
      }
    }).then((res) => {
      if (res.data.code === 1000) {
        console.log('success')
        toggleSelection()
        jobsettingdata()
        jobstatistics()
      } else {
        console.log(res.data)
      }

    }).catch(function (error) {
      console.log("错误信息", error)
    });
  } else if (option == 'change') {
    axios.post('http://192.168.0.117:8081/crontab', {
      parameoption: "edit",
      crontabjob: {
        jobid: Number(addform.jobid),
        jobname: addform.jobname,
        jobstatus: addform.jobstatus,
        jobshell: addform.jobshell,
        jobcronexpr: addform.jobcronexpr,
      }
    }).then((res) => {
      if (res.data.code === 1000) {
        console.log('success')
        jobsettingdata()
        toggleSelection()
        jobstatistics()
      } else {
        console.log(res.data)
      }

    }).catch(function (error) {
      console.log("错误信息", error)
    });
  }else if (option == 'kill') {
    axios.post('http://192.168.0.117:8081/crontab', {
      parameoption: "killjob",
      crontabjob: {
        jobid: Number(form.jobid),
        jobname: form.jobname,
      }
    }).then((res) => {
      if (res.data.code === 1000) {
        console.log('success')
        jobsettingdata()
        toggleSelection()
        jobstatistics()
      } else {
        console.log(res.data.message)
      }

    }).catch(function (error) {
      console.log("错误信息", error)
    });
  } else if (option == 'selectjob'){
    axios.post('http://192.168.0.117:8081/crontab', {
      parameoption: "taskjobselect",
      crontabjob: {
        jobname: addform.jobname
      }
    }).then(
        reponse => {
          console.log("请求数据成功")
          jobdatatable.value = reponse.data.data;
        },
        error => {
          console.log("请求数据失败了:", error.message)
        });
  }

}
const jobstatistics = () => {

  axios.post('http://192.168.0.117:8081/crontab', {
    parameoption: "jobtotal",
  }).then(
      reponse => {
        jobtotal.value = reponse.data.data;
      },
      error => {
        console.log("请求数据失败了:", error.message)
      });
  axios.post('http://192.168.0.117:8081/crontab', {
    parameoption: "jobonline",
  }).then(
      reponse => {
        jobonline.value = reponse.data.data;
        joboffline.value= jobtotal.value - jobonline.value
        onlinerate.value = Math.floor((jobonline.value / jobtotal.value) * 100)
        offlinerate.value = Math.floor((joboffline.value / jobtotal.value) * 100)
      },
      error => {
        console.log("请求数据失败了:", error.message)
      });
  axios.post('http://192.168.0.117:8081/crontab', {
    parameoption: "jobaddtoday"
  }).then(
      reponse => {
        addjobtotal.value = reponse.data.data;
      },
      error => {
        console.log("请求数据失败了:", error.message)
      });
}
const jobsettingdata = () => {
  axios.post('http://192.168.0.117:8081/crontab', {
    parameoption: "init"
  }).then(
      reponse => {
        console.log("请求数据成功")
        tableData.value = reponse.data.data;
      },
      error => {
        console.log("请求数据失败了:", error.message)
      });
  toggleSelection()
  jobstatistics()}

</script>

<style scoped>
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.job-statistics {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
}

.job-card {
  width: 90%;
  margin-top: 20px;
}

.job-card-statistic {
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