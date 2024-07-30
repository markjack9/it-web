<template>
  <div class="g-top-nav">
    <div class="g-logo">
      <img class="g-logo-img" src="/images/logo.png" alt="logo">
    </div>
    <el-page-header @back="onBack" :icon="ArrowLeft">
      <template #content>
        <span class="text-large font-600 mr-3"> 重置密码 </span>
      </template>
    </el-page-header>
  </div>
  <div class="resetpassword">
    <el-card>
      <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
      >
        <el-form-item label="密码" prop="pass">
          <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
              v-model="ruleForm.checkPass"
              type="password"
              autocomplete="off"
          />
        </el-form-item>
        <el-form-item>
          <el-button plain  type="primary" @click="submitForm(ruleFormRef)"
          >确认</el-button>
        </el-form-item>
      </el-form>
    </el-card>


  </div>
</template>

<script lang="ts" setup>
import { ArrowLeft } from '@element-plus/icons-vue'
import router from '../router/index.js'
import { ElNotification as notify } from 'element-plus'
const onBack = () => {
  notify('返回到仪表盘')
  router.push({path: '/dashboard'})
}

import { reactive, ref } from 'vue'
import type { FormInstance, FormRules    } from 'element-plus'
const ruleFormRef = ref<FormInstance>()


const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (ruleForm.checkPass !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass', () => null)
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请在此输入密码！'))
  } else if (value !== ruleForm.pass) {
    callback(new Error("两次密码输入不匹配！"))
  } else {
    callback()
  }
}

const ruleForm = reactive({
  pass: '',
  checkPass: '',
})

const rules = reactive<FormRules>({
  pass: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: validatePass2, trigger: 'blur' }],
})



const passwordsetsucces = () => {
  notify({
    title: 'Success',
    dangerouslyUseHTMLString: true,
    message: '请重新登陆!',
    type: 'success',
  })
  localStorage.clear()
  router.push({path: '/login'})
}
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
      passwordsetsucces()

    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<style scoped>
.g-content-nav div{
  margin: 10px;
  border: 1px solid #ccc;
}
.g-nav a{
  text-decoration: none;
  color: black;
  margin-right: 30px;
  font-size: 25px;
  font-weight: 600;

}

.resetpassword{
  margin: 200px 200px 200px 200px;
  width: 50%;
}
.g-profile span{
  text-decoration: none;
  color: black;
  font-size: 20px;
  font-weight: 600;
}
.g-logo {
  margin: 0 20px;

}
.g-logo-img {
  height: 50px;
}
.g-top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  border-bottom: 1px solid #ccc;
  display: flex;
  flex-flow: row;
  align-items: center;
}

.g-left-arrow img {
  margin: 0 5px 0 auto;
}

.g-left-menu a {
  text-decoration: none;
  color: #222222;
  display: flex;
  flex-flow: row;

}
</style>