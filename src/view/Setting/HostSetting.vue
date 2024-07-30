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
                    <el-button @click="toggleSelection(tableData)">全选</el-button>
                    <el-button @click="toggleSelection()">取消勾选</el-button>
                    <el-button @click="todohostlist('del')">删除</el-button>
                    <el-button @click="hostsettingdata()">刷新</el-button>
                    <el-button @click="openitem()">查看</el-button>
                    <el-dialog
                            v-model="todoeseeitem"
                            :before-close="closedialog"
                            :show-close="false"
                            title="主机信息">
                        <el-form :model="addform" label-width="120px">
                            <el-form-item label="主机名">
                                <el-input v-model="addform.hostname" disabled/>
                            </el-form-item>
                            <el-form-item label="系统类型">
                                <el-select v-model="addform.systemtype" disabled>
                                    <el-option label="windows" value="windows"/>
                                    <el-option label="linux" value="linux"/>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="添加时间">
                                <el-col :span="11">
                                    <el-date-picker
                                            v-model="addform.hostaddtime"
                                            type="date"
                                            placeholder=""
                                            style="width: 100%"
                                            disabled
                                    />
                                </el-col>
                            </el-form-item>
                            <el-form-item label="主机状态">
                                <el-switch v-model="hoststatus" disabled/>
                            </el-form-item>
                            <el-form-item label="主机IP">
                                <el-input v-model="addform.hostip" disabled/>
                            </el-form-item>
                            <el-form-item label="主机负责人">
                                <el-input v-model="addform.hostowner" disabled/>
                            </el-form-item>
                            <el-form-item label="备注">
                                <el-input v-model="addform.hostnote" type="textarea" disabled/>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="todoeseeitem = false;toggleSelection()">关闭</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                    <el-button @click="todoadditem = true">添加</el-button>
                    <el-dialog
                            v-model="todoadditem"
                            :before-close="closedialog"
                            :show-close="false"
                            title="主机信息">
                        <el-form :model="seeform" label-width="120px">
                            <el-form-item label="主机名">
                                <el-input v-model="seeform.hostname" placeholder="请填写主机名称"/>
                            </el-form-item>
                            <el-form-item label="系统类型">
                                <el-select v-model="seeform.systemtype" placeholder="选择系统类型">
                                    <el-option label="windows" value="windows"/>
                                    <el-option label="linux" value="linux"/>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="添加时间">
                                <el-col :span="11">
                                    <el-date-picker
                                            v-model="seeform.hostaddtime"
                                            type="date"
                                            format="YYYY/MM/DD"
                                            value-format="x"
                                            placeholder="添加主机时间"
                                            style="width: 100%"
                                    />
                                </el-col>
                            </el-form-item>
                            <el-form-item label="主机状态">
                                <el-switch v-model="seeform.hoststatus"/>
                            </el-form-item>
                            <el-form-item label="主机IP">
                                <el-input v-model="seeform.hostip" placeholder="主机IP地址"/>
                            </el-form-item>
                            <el-form-item label="主机位置">
                                <el-input v-model="seeform.hostlocation" placeholder="主机所在地"/>
                            </el-form-item>
                            <el-form-item label="主机负责人">
                                <el-input v-model="seeform.hostowner" placeholder="主机管理员"/>
                            </el-form-item>
                            <el-form-item label="备注">
                                <el-input v-model="seeform.hostnote" type="textarea" placeholder="备注说明"/>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="todoadditem = false;todohostlist('add')">确定
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
                            title="编辑主机信息">
                        <el-form :model="addform" label-width="120px">
                            <el-form-item label="主机名">
                                <el-input v-model="addform.hostname" placeholder=""/>
                            </el-form-item>
                            <el-form-item label="系统类型">
                                <el-select v-model="addform.systemtype" placeholder="">
                                    <el-option label="windows" value="windows"/>
                                    <el-option label="linux" value="linux"/>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="添加时间" >
                                <el-col :span="11">
                                    <el-date-picker
                                            v-model="addform.hostaddtime"
                                            type="date"
                                            placeholder=""
                                            style="width: 100%"
                                            disabled
                                    />
                                </el-col>
                            </el-form-item>
                            <el-form-item label="主机状态">
                                <el-switch v-model="hoststatus" @click="clickhoststatus"/>
                            </el-form-item>
                            <el-form-item label="主机IP">
                                <el-input v-model="addform.hostip" placeholder=""/>
                            </el-form-item>
                            <el-form-item label="主机负责人">
                                <el-input v-model="addform.hostowner" placeholder=""/>
                            </el-form-item>
                            <el-form-item label="备注">
                                <el-input v-model="addform.hostnote" type="textarea" placeholder=""/>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="todoedititem = false;todohostlist('change')">确定
                                </el-button>
                                <el-button @click="todoedititem = false;toggleSelection()">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                    <el-table
                            ref="multipleTableRef"
                            :data="tableData"
                            style="width: 100%"
                            class="host-card-list"
                            @selection-change="handleSelectionChange"
                    >
                        <el-table-column type="selection" width="55"/>
                        <el-table-column label="序号" width="120">
                            <template #default="scope">{{ scope.row.hostid }}</template>
                        </el-table-column>
                        <el-table-column prop="hostname" align="center" label="主机名" width="120"/>
                        <el-table-column prop="systemtype" align="center"  label="系统版本" width="120"/>
                        <el-table-column prop="hoststatus" align="center"  :formatter="statusicon" label="主机状态" width="120"/>
                        <el-table-column prop="hostip" align="center"  label="主机IP" width="120"/>
                        <el-table-column prop="hostlocation" align="center"  label="主机位置" width="120"/>
                        <el-table-column prop="hostowner" align="center"  label="主机负责人" width="120"/>
                        <el-table-column prop="hostaddtime" align="center"  label="添加时间" width="120"/>
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

interface Hostinfo {
    hostid: number
    hostname: string
    systemtype: string
    hoststatus: number
    hostip: string
    hostlocation: string
    hostowner: string
    hostaddtime: string
    hostnote: string
}

let form: Hostinfo
const hosttotal = ref(0)
const hostonline = ref(0)
const  hostoffline = ref(0)
const addhosttotal = ref(0)
const onlinerate = ref(0)
const offlinerate = ref(0)
const hoststatus = ref(true)
const tableData = ref<Hostinfo[]>([])
const todoadditem = ref(false)
const todoedititem = ref(false)
const todoeseeitem = ref(false)
const isselect = ref(false)
const closedialog = (done) => {
    toggleSelection()
    done();
}
const clickhoststatus = () => {
    if (form.hoststatus === 1 ) {
        addform.hoststatus = 0
    } else if (form.hoststatus === 0 ) {
        addform.hoststatus = 1
    }

}
const seeform =  reactive({
    hostid: "",
    hostname: "",
    systemtype: "",
    hoststatus: 1,
    hostip: "",
    hostlocation: "",
    hostowner: "",
    hostaddtime: "",
    hostnote: "",
})
const addform = reactive({
    hostid: "",
    hostname: "",
    systemtype: "",
    hoststatus: 1,
    hostip: "",
    hostlocation: "",
    hostowner: "",
    hostaddtime: "",
    hostnote: "",
})
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<Hostinfo[]>([])
const toggleSelection = (rows?: Hostinfo[]) => {
    if (rows) {
        multipleTableRef.value!.toggleAllSelection()
    } else {
        multipleTableRef.value!.clearSelection()
        isselect.value = false
        hoststatus.value = false

    }
}
const handleSelectionChange = (val: Hostinfo[]) => {
    multipleSelection.value = val
    form = val[0]
    isselect.value = true
    addform.hostname = form.hostname
    addform.systemtype = form.systemtype
    addform.hostaddtime = form.hostaddtime
    addform.hostip = form.hostip
    addform.hostlocation = form.hostlocation
    addform.hostowner = form.hostowner
    addform.hostnote = form.hostnote
    if (form.hoststatus === 0){
        hoststatus.value = false
    }else if (form.hoststatus === 1) {
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
            console.log("删除数据",form.hostid)
            axios.post('http://192.168.0.117:8081/hostlistdata', {
                typeoperation: "del",
                hostlist: {
                    hostid: form.hostid
                }
            }).then((res) => {
                if (res.data.code === 1000) {
                    console.log('success')
                    toggleSelection()
                    hostsettingdata()
                  hoststatistics()
                } else {
                    console.log(res.data.message)
                }

            }).catch(function (error) {
                console.log("错误信息", error)
            });

        })
}
const statusicon = (row)=> {
  if (row.hoststatus === 1) {
    return '在线'
  } else  {
    return '离线'
  }
}
onMounted(() => {
    hostsettingdata()
  hoststatistics()
})
const todohostlist = (option: string) => {

    if (option == 'del') {
        DeleteNoti()
    } else if (option == 'add') {
        if (seeform.hoststatus === true) {
            seeform.hoststatus = 1
        } else {
            seeform.hoststatus = 0
        }
      axios.post('http://192.168.0.117:8081/hostlistdata', {
            typeoperation: "add",
            hostlist: {
                hostname: seeform.hostname,
                systemtype: seeform.systemtype,
                hoststatus: seeform.hoststatus,
                hostip: seeform.hostip,
                hostlocation: seeform.hostlocation,
                hostowner: seeform.hostowner,
                hostaddtime: String(seeform.hostaddtime),
                hostnote: seeform.hostnote
            }
        }).then((res) => {
            if (res.data.code === 1000) {
                console.log('success')
                toggleSelection()
                hostsettingdata()
              hoststatistics()
            } else {
                console.log(res.data)
            }

        }).catch(function (error) {
            console.log("错误信息", error)
        });
    } else if (option == 'change') {
        axios.post('http://192.168.0.117:8081/hostlistdata', {
            typeoperation: "edit",
            hostlist: {
                hostid: form.hostid,
                hostname: addform.hostname,
                systemtype: addform.systemtype,
                hoststatus: addform.hoststatus,
                hostip: addform.hostip,
                hostlocation: addform.hostlocation,
                hostowner: addform.hostowner,
                hostnote: addform.hostnote
            }
        }).then((res) => {
            if (res.data.code === 1000) {
                console.log('success')
                hostsettingdata()
                toggleSelection()
                hoststatistics()
            } else {
                console.log(res.data.message)
            }

        }).catch(function (error) {
            console.log("错误信息", error)
        });
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
const hostsettingdata = () => {
    axios.post('http://192.168.0.117:8081/hostlistdata', {
        typeoperation: "init"
    }).then(
        reponse => {
            console.log("请求数据成功")
            tableData.value = reponse.data.data;
        },
        error => {
            console.log("请求数据失败了:", error.message)
        });
    toggleSelection()
  hoststatistics()}

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