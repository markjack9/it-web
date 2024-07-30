<template>
<div class="logsetting">
  <div>
    <el-card  class="log-card-statistic">
      <el-text class="log-text">SSH远程工具</el-text>
      <el-form style="margin-top: 20px" :model="form" label-width="120px">
          <el-form-item label="用户名">
            <el-input v-model="form.name" style="width: 150px"  clearable/>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password" style="width: 150px" type="password" clearable/>
          </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" style="width: 150px" clearable/>
        </el-form-item>
          <el-form-item label="端口号">
            <el-input v-model="form.port" style="width: 150px" clearable/>
          </el-form-item>
        <el-form-item label="执行shell">
          <el-input v-model="form.command" type="textarea"  clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="todosomething">执行</el-button>
        </el-form-item>
      </el-form>
      <el-card>
        <el-text class="log-text">执行结果</el-text>
        <el-scrollbar height="400px">
          <pre class="preclass">{{ something }}</pre>
        </el-scrollbar>
      </el-card>
    </el-card>
  </div>
</div>
</template>

<script lang="ts" setup>
import { reactive ,ref} from 'vue'
import axios from "axios";
const something= ref('')
// do not use same name with ref
const form = reactive({
  name: '',
  password:'',
  address: '',
  command: '',
  port: null,
})
const todosomething= () => {
  axios.post('http://192.168.0.117:8081/crontab', {
    parameoption: "sshshell",
    sshtool: {
      username: form.name,
      port: Number(form.port),
      address: form.address,
      password: form.password,
      shell: form.command
    }
  }).then(
      reponse => {
        console.log("请求数据成功")
        something.value = reponse.data.data
      },
      error => {
        console.log("请求数据失败了:", error.message)
      });
}

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
.preclass{
  margin-top: 10px;
  font-size: 14px;
  font-family: initial;
}
</style>