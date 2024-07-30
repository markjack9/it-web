<template>
  <div  class="alarm-statistics">
    <div >
      <div class="notificationsetting">
        <div >
          <el-card class="alarm-card-statistic">
            <el-card  >
              <el-collapse accordion @change="confirmation('init')">
                <el-collapse-item name="1">
                  <template #title>
                    <el-text class="notificationsetting-text">钉钉设置</el-text>
                  </template>
                  <el-form :model="notiapiform" label-width="120px">
                    <el-form-item label="API接口" >
                      <el-input v-model="notiapiform.dingapiurl" type="textarea" placeholder="钉钉接口链接" @input="changinput" clearable/>
                    </el-form-item>
                    <el-form-item label="通知用户">
                      <el-input v-model="notiapiform.dingatuser" placeholder="@通知的用户" @input="changinput"/>
                      <el-button class="confirmation-button" @click="confirmation('notiok')">保存</el-button>
                    </el-form-item>

                  </el-form>

                </el-collapse-item>
              </el-collapse>
            </el-card>
            <el-card >
              <el-collapse accordion>
                <el-collapse-item name="2">
                  <template #title>
                    <el-text class="notificationsetting-text">企业微信设置</el-text>
                  </template>
                  <el-form :model="notiapiform" label-width="120px">
                    <el-form-item label="API接口">
                      <el-input v-model="notiapiform.workapiurl" type="textarea" placeholder="企业微信接口链接" @input="changinput" clearable/>
                    </el-form-item>
                    <el-form-item label="通知用户">
                      <el-input v-model="notiapiform.workatuser" placeholder="@通知的用户" @input="changinput"/>
                      <el-button class="confirmation-button" @click="confirmation('notiok')">保存</el-button>

                    </el-form-item>
                  </el-form>
                </el-collapse-item>
              </el-collapse>
            </el-card>
            <el-card >
              <el-collapse accordion>
                <el-collapse-item name="3" @click="openstatusvalue">
                  <template #title>
                    <el-text class="notificationsetting-text">报警阀值设置</el-text>
                  </template>
                  <el-switch
                      v-model="openstatus"
                      size="large"
                      inline-prompt
                      @click="statuswitch"
                      active-text="开启"
                      inactive-text="关闭"
                  />
                  <el-form :model="notithresolad" label-width="120px">
                    <el-form-item label="处理器使用率">
                      <el-input v-model="notithresolad.cpuoption" @input="changinput"/>
                    </el-form-item>
                    <el-form-item label="内存使用率">
                      <el-input v-model="notithresolad.memoryoption" @input="changinput"/>
                    </el-form-item>
                    <el-form-item label="系统磁盘使用率">
                      <el-input v-model="notithresolad.systemdiskoption" @input="changinput"/>
                    </el-form-item>
                  </el-form>
                  <el-button class="confirmation-button" @click="confirmation('updatethreshold')">保存</el-button>
                </el-collapse-item>
              </el-collapse>
            </el-card>
          </el-card>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import {onMounted, reactive} from 'vue'
import { ref } from 'vue'
import axios from "axios"
import {stringify} from "qs";
import {number} from "echarts";
let worknotiapi = reactive({
  notiapi: {
    workapiurl: "",
    dingapiurl: "",
    dingatuser: "",
    workatuser: "",
  },
  cpuoption: 0,
  memoryoption: 0,
  systemdiskoption: 0,
  thresholadstatus: 0,

})
let notiapiform = reactive({
  workapiurl: "",
  dingapiurl: "",
  dingatuser: "",
  workatuser: "",
})

let notithresolad = reactive({
  cpuoption: 0,
  memoryoption: 0,
  systemdiskoption: 0,
  thresholadstatus: 0,
})
const changinput = () =>{
  this.$forceUpdate()
}
const statuswitch = () => {
  if (notithresolad.thresholadstatus === 1){
    notithresolad.thresholadstatus = 0
  }else {
    notithresolad.thresholadstatus = 1
  }
}
const openstatus = ref(false)
const openstatusvalue = () => {
  if (notithresolad.thresholadstatus === 1){
    openstatus.value = true
  }else if (notithresolad.thresholadstatus === 0) {
    openstatus.value = false
  }
}
onMounted(() => {
  confirmation('init')
})
const confirmation = (option: string) => {
if (option === 'notiok'){
  axios.post('http://192.168.0.117:8081/alarmsetting', {
    alarmoption: "updatenoti",
    notiapi: {
      workapiurl: notiapiform.workapiurl,
      dingapiurl: notiapiform.dingapiurl,
      dingatuser: notiapiform.dingatuser,
      workatuser: notiapiform.workatuser,
    }
  }).then((res) => {
    if (res.data.code === 1000) {
      console.log('success')
    } else {
      console.log(res.data.message)
    }

  }).catch(function (error) {
    console.log("错误信息", error)
  });
}else if (option === 'updatethreshold'){
  axios.post('http://192.168.0.117:8081/alarmsetting',  {
    alarmoption: "updatethreshold",
    cpuoption: Number(notithresolad.cpuoption),
    memoryoption:  Number(notithresolad.memoryoption),
    systemdiskoption:  Number(notithresolad.systemdiskoption),
    thresholadstatus: notithresolad.thresholadstatus,
  }).then((res) => {
    if (res.data.code === 1000) {
      console.log('success')
    } else {
      console.log(res.data)
    }

  }).catch(function (error) {
    console.log("错误信息", error)
  });
}

else if (option === 'init'){
  axios.post('http://192.168.0.117:8081/alarmsetting', {
    alarmoption: "optioninit"
  }).then((res) => {
    if (res.data.code === 1000) {
      worknotiapi= res.data.data
      notiapiform = worknotiapi[0].notiapi
      notithresolad = worknotiapi[0]
      console.log('success')
    } else {
      console.log(res.data.message, res.data)
    }
  }).catch(function (error) {
    console.log("错误信息", error)
  });
}
}

</script>

<style scoped>
.confirmation-button{
margin-top: 20px;
  margin-left: 20px;
}
.notificationsetting{
  width: 100%;
}
.notificationsetting-text{
  font-size: 16px;
  font-weight: bolder;
}
.alarm-statistics {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
}
.alarm-card-statistic {
  width: 90%;
  display: flex;
  flex-direction: column;

}
.alarm-card {
  width: 90%;
  margin-top: 20px;
}
</style>