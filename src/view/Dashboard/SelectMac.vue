<template>
  <div class="logsetting">
    <div class="log-content">
      <el-card ref="loadingCard" class="log-card-statistic">
        <div class="loading-container">
        <el-text class="log-text">查询设备MAC端口</el-text>
        <el-form style="margin-top: 20px" :model="selectmac" label-width="120px">
          <el-form-item label="位置">
            <el-select
                v-model="selectedSwitchLevel"
                placeholder="选择"
                size="large"
                style="width: 240px"
                @change="handleSelectChange"
            >
              <el-option
                  v-for="item in switchLeveloption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="MAC地址">
            <el-input
                v-model="selectmac.shortMac"
                style="width: 150px"
                placeholder="完整MAC地址"
                clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="todosomething">查询</el-button>
          </el-form-item>
        </el-form>
        </div>
      </el-card>

      <!-- 查询结果部分 -->
      <el-card class="log-card-result" style="max-width: 300px">
        <template #header>
          <div class="card-header">
            <el-text class="log-text">查询结果</el-text>
          </div>
        </template>
        <el-form :model="something" label-width="120px">
          <el-form-item label="网段：">
            <el-input v-model="something.Vlan" placeholder="网段" readonly></el-input>
          </el-form-item>
          <el-form-item label="交换机端口：">
            <el-input v-model="something.SwitchPort" placeholder="交换机端口" readonly></el-input>
          </el-form-item>
          <el-form-item label="归属交换机：">
            <el-input v-model="something.SwitchName" placeholder="归属交换机名称" readonly></el-input>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { ElLoading } from 'element-plus';
import axios from "axios";
const loadingCard = ref(null);

const something = reactive({
  Vlan: "",
  SwitchPort: "",
  SwitchName: "",
});

const selectmac = reactive({
  switchLevel: 0,
  shortMac: '',
});

const selectedSwitchLevel = ref(null);

const handleSelectChange = (value) => {
  selectmac.switchLevel = Number(value);
};

const switchLeveloption = [
  {
    value: 502,
    label: '5楼',
  },
  {
    value: 801,
    label: '8楼',
  },
];

const todosomething = () => {
  const loadingInstance = ElLoading.service({// 只针对这个元素显示加载动画
    target: loadingCard.value.$el.querySelector('.loading-container'),
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  axios.post('http://192.168.8.84:8081/selectswitch', {
    switchLevel: selectmac.switchLevel,
    shortMac: selectmac.shortMac,
  }).then(
      response => {
        something.Vlan = response.data.data.Vlan || '';
        something.SwitchPort = response.data.data.SwitchPort || '';
        something.SwitchName = response.data.data.SwitchName || '';
        loadingInstance.close();
      },
      error => {
        console.log("请求数据失败了:", error.message);
        loadingInstance.close();
      }
  );
};
</script>

<style scoped>

.logsetting {
  display: flex;
  width: 100%;
}
.log-card-statistic {
  position: relative; /* 确保加载动画在卡片内 */
  margin-right: 20px; /* 增加右侧间距 */
  width: 30%;
}
.log-content {
  display: flex;
  width: 100%;
}
.loading-container {
  position: relative; /* 确保加载动画只在这个容器内 */
}

.log-card-result {
  width: auto;
}

.log-text {
  font-size: 20px;
  font-weight: bolder;
}
</style>
