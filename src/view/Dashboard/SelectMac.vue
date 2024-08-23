<template>
  <div class="logsetting">
    <div class="log-content">
      <el-card ref="loadingCard" class="log-card-statistic">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane label="查询设备 MAC 端口" name="query">
            <div class="loading-container">
              <el-text class="log-text">查询设备MAC端口</el-text>
              <el-form style="margin-top: 20px" :model="selectmac" label-width="120px">
                <el-form-item label="位置">
                  <el-select
                      v-model="selectedSwitchLevel"
                      placeholder="选择"
                      size="large"
                      style="width: 200px"
                      @change="handleSelectChange('query')"
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
                      style="width: 200px"
                      placeholder="完整MAC地址"
                      clearable
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="queryMac">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>

          <el-tab-pane label="修改设备 MAC 端口" name="modify">
            <div class="loading-containermodif">
              <el-text class="log-text">修改设备MAC端口</el-text>
              <el-form style="margin-top: 20px" :model="changevlan" label-width="120px">
                <el-form-item label="位置">
                  <el-select
                      v-model="selectedSwitchLevel"
                      placeholder="选择"
                      size="large"
                      style="width: 200px"
                      @change="handleSelectChange('modify')"
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
                      v-model="changevlan.shortMac"
                      style="width: 200px"
                      placeholder="完整MAC地址"
                      clearable
                  />
                </el-form-item>
                <el-form-item label="网段">
                  <el-input
                      v-model="changevlan.changVlan"
                      style="width: 60px"
                      placeholder="网段"
                      clearable
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="modifyMacVlan">提交</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 查询或修改结果部分 -->
      <el-card class="log-card-result" style="max-width: 300px">
        <template #header>
          <div class="card-header">
            <el-text class="log-text">操作结果</el-text>
          </div>
        </template>
        <el-form :model="something" label-width="120px">
          <el-form-item label="网段：">
            <el-input v-model="something.Vlan" placeholder="网段" readonly></el-input>
          </el-form-item>
          <el-form-item label="归属交换机：">
            <el-input v-model="something.SwitchName" placeholder="归属交换机名称" readonly></el-input>
          </el-form-item>
          <el-form-item label="交换机端口：">
            <el-input v-model="something.SwitchPort" placeholder="交换机端口" readonly></el-input>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 历史记录部分 -->
    <el-card class="history-card">
      <template #header>
        <div class="card-header">
          <el-text class="log-text">历史记录</el-text>
        </div>
      </template>
      <el-timeline>
        <!-- 查询记录 -->
        <el-timeline-item
            v-for="(record, index) in queryRecords"
            :key="index"
            :timestamp="record.timestamp"
            placement="top"
        >
          查询: {{ record.message }}
        </el-timeline-item>

        <!-- 修改记录 -->
        <el-timeline-item
            v-for="(record, index) in modifyRecords"
            :key="index"
            :timestamp="record.timestamp"
            placement="top"
            type="success"
        >
          修改: {{ record.message }}
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue';
import { ElLoading } from 'element-plus';
import axios from "axios";

const loadingCard = ref(null);
const activeTab = ref('query'); // 控制当前选中的 Tab

const something = reactive({
  Vlan: "",
  SwitchPort: "",
  SwitchName: "",
});

const selectmac = reactive({
  switchLevel: 0,
  shortMac: '',
});

const changevlan = reactive({
  switchLevel: 0,
  shortMac: '',
  changVlan: 0,
});

const selectedSwitchLevel = ref(null);
const historyRecords = ref<{ timestamp: string; message: string; type: string }[]>([]); // 存储历史记录，包括类型

const handleSelectChange = (tab) => {
  if (tab === 'query') {
    selectmac.switchLevel = Number(selectedSwitchLevel.value);
  } else if (tab === 'modify') {
    changevlan.switchLevel = Number(selectedSwitchLevel.value);
  }
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
// 重置表单的函数
const resetForm = (formType) => {
  selectedSwitchLevel.value = null; // 重置位置选择框
  if (formType === 'query') {
    selectmac.switchLevel = 0;
    selectmac.shortMac = '';
  } else if (formType === 'modify') {
    changevlan.switchLevel = 0;
    changevlan.shortMac = '';
    changevlan.changVlan = 0;
  }
};

// 监听选项卡切换
const handleTabClick = (tab) => {
  const tabName = tab.props.name || tab.paneName; // 获取选项卡名称
  if (tabName === 'query') {
    resetForm('query');
  } else if (tabName === 'modify') {
    resetForm('modify');
  }
};
// 查询 MAC 地址对应的端口
const queryMac = () => {
  const loadingInstance = ElLoading.service({
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

        // 添加查询记录
        addHistoryRecord(`MAC 地址 ${selectmac.shortMac}`, 'query');

        loadingInstance.close();
      },
      error => {
        console.log("请求数据失败了:", error.message);
        loadingInstance.close();
      }
  );
};

// 修改 MAC 地址的 VLAN
const modifyMacVlan = () => {
  const loadingInstance = ElLoading.service({
    target: loadingCard.value.$el.querySelector('.loading-containermodif'),
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const changVlanAsNumber = Number(changevlan.changVlan);
  axios.post('http://192.168.8.84:8081/selectswitchchangvlan', {
    switchLevel: changevlan.switchLevel,
    shortMac: changevlan.shortMac,
    changVlan: changVlanAsNumber,
  }).then(
      response => {
        something.Vlan = response.data.data.Vlan || '';
        something.SwitchPort = response.data.data.SwitchPort || '';
        something.SwitchName = response.data.data.SwitchName || '';

        // 添加修改记录
        addHistoryRecord(`交换机：${something.SwitchName}端口：${something.SwitchPort}MAC 地址:${changevlan.shortMac} 的 VLAN: ${changVlanAsNumber}`, 'modify');

        loadingInstance.close();
      },
      error => {
        console.log("请求数据失败了:", error.message);
        loadingInstance.close();
      }
  );
};

// 添加历史记录
const addHistoryRecord = (message: string, type: string) => {
  const timestamp = new Date().toLocaleString();
  historyRecords.value.push({ timestamp, message, type });
};

// 计算查询和修改记录
const queryRecords = computed(() => historyRecords.value.filter(record => record.type === 'query'));
const modifyRecords = computed(() => historyRecords.value.filter(record => record.type === 'modify'));
</script>

<style scoped>
.logsetting {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.log-card-statistic {
  position: relative;
  margin-right: 20px;
  width: 50%;
}
.log-content {
  display: flex;
  width: 100%;
}
.loading-container {
  position: relative;
}
.loading-containermodif {
  position: relative;
}
.log-card-result {
  width: auto;
}

.history-card {
  margin-top: 20px;
  width: 100%;
}

.log-text {
  font-size: 20px;
  font-weight: bolder;
}
</style>
