<template>
  <div class="login">
    <div class="loginidex">
      <div>
        <el-card class="logincard">
          <div class="text">
<el-text class="title">登陆</el-text>
          </div>
          <el-card class="userinfo">
            <el-input v-model="userinfo.name" placeholder="请输入用户名"/>
            <el-input
                v-model="userinfo.password"
                type="password"
                placeholder="请输入密码"
                show-password
            />
          </el-card>
          <div class="login-btn">
            <el-button type="primary" plain @click="dologin()" class="btn">登录</el-button>
            <div class="btn">
              <el-button text @click="dialogFormVisible = true">
                忘记密码
              </el-button>
              <el-dialog v-model="dialogFormVisible" title="忘记密码">
                <el-form :model="form">
                  <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"/>
                  </el-form-item>
                  <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"/>
                  </el-form-item>
                </el-form>
                <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="forgotpwd">
          确认
        </el-button>
      </span>
                </template>
              </el-dialog>
            </div>
          </div>

        </el-card>
      </div>
    </div>
  </div>

</template>
<style scoped>
.loginidex {
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 500px;
  margin-top: 10%;

}
.login-btn {
  display: flex;
  margin-left: 10px;
  justify-content: space-between;
}
.btn {
  margin-top: 20px;
  align-items: center;
}
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
}
.title {
  font-size: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
}
.userinfo{
margin-top: 100px;
  border: 1px solid var(--el-border-color);

}

.logincard {
  height: 400px;
  border: 2px solid var(--el-border-color);
  background-image: url(../../public/images/clouds-blue-sky-light-31912398.jpg);
}
</style>
<script lang="ts" setup>
import axios from 'axios';
import {reactive, ref} from 'vue'
import router from '../router/index.js'
import { ElMessage } from 'element-plus'

const dialogTableVisible = ref(false)
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
const forgotpwd = () => {
  console.log("密码已发送邮箱")
}
const form = reactive({
  name: '',
  email: '',
})
const userinfo = reactive({
  name: "",
  password: "",
})

const dologin = () => {
  axios.post('http://192.168.0.117:8081/login', {
    username: userinfo.name,
    password: userinfo.password
  }).then((res) => {
    if (res.data.code === 1000) {
      console.log("登陆成功")
      localStorage.setItem("loginResult", JSON.stringify(res.data));
      router.push({path: '/'})

    } else {
      ElMessage.error('用户名密码错误')
      console.log(res.data.message)
    }

  }).catch(function (error) {
    console.log("错误信息", error)
    ElMessage.error('用户名密码错误')
  });
}

</script>