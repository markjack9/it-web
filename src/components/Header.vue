<template>

  <!--头部导航-->
  <div class="g-top-nav">
    <div class="g-logo">
      <img class="g-logo-img" src="/images/logo.png" alt="logo">
    </div>
    <div class="g-title">一个活泼的小猫</div>
    <div class="g-nav">
      <router-link to="dashboard" active-class="dashboard" >仪表盘</router-link>
      <router-link to="setting" active-class="dashboard">配置</router-link>
      <router-link to="manage" active-class="dashboard">管理</router-link>
      <router-link to="recording" active-class="dashboard">记录</router-link>
    </div>
    <div class="g-profile" >
      <div class="flex flex-wrap items-center">
        <el-dropdown @command="handleCommand">
          <el-button type="primary">
           管理员<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu >
              <el-dropdown-item  command="reset-password">重置密码</el-dropdown-item>
              <el-dropdown-item  command="exit">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'
import router from '../router/index.js'
const handleCommand = (command:string) => {
  if (command === "reset-password") {
    router.push({path: '/resetpwd'})
  } else if (command ==="exit") {
    localStorage.clear()
    router.push({path: '/login'})
  }

}
</script>




<style scoped>

.g-content-nav div{
  margin: 10px;
  border: 1px solid #ccc;
}
.g-nav a{
  text-decoration: none;
  color: #040000;
  margin-right: 30px;
  font-size: 25px;
  font-weight: 600;

}

.g-nav a.dashboard {
  color: rgb(46, 172, 244);
  border-bottom: 5px solid rgb(22,115,232);
  padding-bottom: 14px;
}
.g-profile {
  margin-left: auto;
  margin-right: 50px;

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
.g-title {
  font-size: 18px;
  font-weight: 600;
  width: 300px;

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
  background-color: rgb(242, 247, 249);
  z-index: 1000;
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
.example-showcase .el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>