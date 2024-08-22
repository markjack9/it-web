<template>
  <div>
    <el-card class="host-card-statistic">
      <el-button type="primary" @click="createinterface = true; generateinterface()" :disabled="!selectedSwitch">查看当前端口连接图</el-button>
      <el-dialog
          v-model="createinterface"
          :before-close="closedialog"
          :show-close="false"
          title="接口详情"
          width="80%">
        <el-button @click="createinterface = false">关闭窗口</el-button>
        <el-tabs>
          <el-tab-pane>
            <el-row :gutter="20">
              <el-col
                  v-for="(item, index) in paginatedData"
                  :key="index"
                  :span="4"
                  style="margin-bottom: 20px;"
              >
                <el-card :class="{
    'card-up': item.PHY === 'up' || item.PHY === 'connected',
    'card-down': item.PHY === 'down' || item.PHY === 'notconnect'
}">
                  <div class="loadingcardcard">
                  <div class="interface-box">
                    <p>网段: {{ item.PVID }}</p>
                    <p>网口：{{ item.Interface }}</p>
                    <p>端口类型: {{ item.LinkType }}</p>
                    <p>端口状态：{{ item.PHY }}</p>
                  </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <!-- 分页 -->
            <el-pagination
                background
                layout="prev, pager, next"
                :page-size="itemsPerPage"
                :total="interfaceData.length"
                v-model:current-page="currentPage"
                @current-change="switchPage"
            />
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
      <el-button type="primary" @click="createtopology = true; generateTopology()" :disabled="!selectedSwitch">生成拓扑图</el-button>
      <el-dialog
          ref="loadingCard"
          v-model="createtopology"
          :before-close="closedialog"
          :show-close="false"
          title="拓扑图"
          width="80%"> <!-- 控制对话框宽度 -->
        <el-button @click="createtopology = false">关闭窗口</el-button>
        <div ref="networkContainer" style="width: 100%; height: 600px; margin-top: 10px;"></div>
      </el-dialog>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="5楼" name="5">
          <div class="switch-card-container">
            <el-row :gutter="20">
              <el-col :span="4" v-for="switchItem in filteredSwitchList('5')" :key="switchItem.switchnumber">
                <el-card
                    :class="{'is-selected': selectedSwitch && selectedSwitch.switchnumber === switchItem.switchnumber}"
                    class="switch-card"
                    @click="selectSwitch(switchItem)"
                >
                  <div class="switch-content">
                    <p>{{ switchItem.switchname }}</p>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="8楼" name="8">
          <div class="switch-card-container">
            <el-row :gutter="20">
              <el-col :span="4" v-for="switchItem in filteredSwitchList('8')" :key="switchItem.switchnumber">
                <el-card
                    :class="{'is-selected': selectedSwitch && selectedSwitch.switchnumber === switchItem.switchnumber}"
                    class="switch-card"
                    @click="selectSwitch(switchItem)"
                >
                  <div class="switch-content">
                    <p>{{ switchItem.switchname }}</p>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted,  computed,reactive, ref } from 'vue';
import { Network, DataSet } from 'vis-network/standalone';
import axios from 'axios';
import {ElLoading} from "element-plus";
const createtopology = ref(false);
const createinterface = ref(false);
const networkContainer = ref<HTMLDivElement | null>(null);
const switchtotallist = reactive<{ switchname: string, switchnumber: number, floor: string }[]>([]);
const selectedSwitch = ref<{ switchname: string, switchnumber: number, floor: string } | null>(null);
const activeTab = ref("5"); // 当前活动的 Tab 页
const interfaceData = ref([]); // 存储接口获取的数据
const currentPage = ref(1); // 当前页码
const itemsPerPage = 28; // 每页显示的条数
// 页码切换时触发
const switchPage = (newPage) => {
  currentPage.value = newPage;
};
const loadingCard = ref(null);
// 计算分页后的数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return interfaceData.value.slice(start, end);
});

const selectswitchtotal = () => {
  axios.post('http://192.168.8.84:8081/selectswitchtotal', {
    switchname: "8.66",
  }).then(
      response => {
        const processedData = response.data.data.map(item => {
          return {
            ...item,
            floor: item.switchname.startsWith("5.") ? "5" : item.switchname.startsWith("8.") ? "8" : "unknown"
          };
        });

        switchtotallist.splice(0, switchtotallist.length, ...processedData);
      },
      error => {
        console.log("请求数据失败了:", error.message);
      }
  );
};

// 选择交换机
const selectSwitch = (switchItem: { switchname: string, switchnumber: number, floor: string }) => {
  selectedSwitch.value = switchItem;
};

// 过滤楼层数据
const filteredSwitchList = (floor: string) => {
  return switchtotallist.filter(switchItem => switchItem.floor === floor);
};

const generateTopology = async () => {

  if (!selectedSwitch.value) {
    console.error("请先选择一个交换机！");
    return;
  }

  const centralNode = {
    id: selectedSwitch.value.switchnumber,
    SwitchName: selectedSwitch.value.switchname,
    SInterface: "",
    SwitchPlatform: "",
    SwitchMac: "",
  };

  try {
    const response = await axios.post('http://192.168.8.84:8081/selectneighbors', {
      switchname: selectedSwitch.value.switchname,
    });

    const rawData = response.data.data;
    const upperDevice = rawData.find(device => device.IsUpperDevice);
    const lowerDevices = rawData.filter(device => !device.IsUpperDevice);

    const nodes = new DataSet([
      {
        id: upperDevice?.SelectNumber,
        label: upperDevice?.SwitchName,
        title: `Platform: ${upperDevice?.SwitchPlatform || 'Unknown'}\nMAC: ${upperDevice?.SwitchMac || 'N/A'}`,
        shape: 'box',
        group: 'switch',
        labelAlignment: 'right',
      },
      {
        id: centralNode.id,
        label: centralNode.SwitchName,
        title: `Platform: ${centralNode.SwitchPlatform || 'Unknown'}\nMAC: ${centralNode.SwitchMac || 'N/A'}`,
        shape: 'box',
        group: 'switch',
        fixed: true,
        labelAlignment: 'right',
      },
      ...lowerDevices.map((device) => ({
        id: device.SelectNumber,
        label: device.SwitchName,
        title: `Platform: ${device.SwitchPlatform}\nMAC: ${device.SwitchMac}`,
        shape: 'box',
        group: 'switch',
        labelAlignment: 'right',
      }))
    ]);

    const edges = new DataSet([
      {
        from: upperDevice?.SelectNumber,
        to: centralNode.id,
        label: `${upperDevice?.SInterface} -> ${upperDevice?.DInterface}`,
        font: {
          vAlign: 'top',
        },
        smooth: { type: 'cubicBezier', roundness: 0.4 },
        width: 3,
      },
      ...lowerDevices.map((device) => ({
        from: centralNode.id,
        to: device.SelectNumber,
        label: `${device.SInterface} -> ${device.DInterface}`,
        font: {
          vAlign: 'top',
        },
        smooth: { type: 'cubicBezier', roundness: 0.4 },
        width: 3,
      }))
    ]);

    if (networkContainer.value) {
      const data = { nodes, edges };
      const options = {
        layout: {
          hierarchical: {
            direction: 'LR',
            sortMethod: 'directed',
            nodeSpacing: 250,
            levelSeparation: 300,
          },
        },
        physics: {
          enabled: true,
          hierarchicalRepulsion: {
            nodeDistance: 150,
            springLength: 200,
          },
        },
        edges: {
          smooth: {
            type: 'cubicBezier',
            roundness: 0.4,
          },
          width: 3,
          color: { color: '#848484' },
        },
        interaction: {
          hover: true,
        },
      };

      new Network(networkContainer.value, data, options);
    }
  } catch (error) {
    console.error("请求数据失败:", error);
  }
};
const generateinterface = async () => {
  if (!selectedSwitch.value) {
    console.error("请先选择一个交换机！");
    return;
  }

  const response = await axios.post('http://192.168.8.84:8081/selectinterfacedetail', {
    switchname: selectedSwitch.value.switchname,
  });
  interfaceData.value = response.data.data
};
onMounted(() => {
  selectswitchtotal();
});
</script>

<style>
.host-card-statistic {
  width: 90%;
}

.switch-card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
}

.switch-card {
  cursor: pointer;
  width: 100px;
  height: 80px;
  margin-bottom: 5px;
}
.card-up {
  border: 2px solid green !important;
}

.card-down {
  border: 2px solid red !important;
}
/* 覆盖 el-card 的默认边框样式 */
.el-card__header,
.el-card {
  border-radius: 5px;
  border: none;
}
.switch-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80%;
  font-size: 12px;
  font-weight: bold;
}
.switch-card.is-selected {
  box-shadow: 0 0 10px #409EFF;
  border: 2px solid #409EFF;
}
.interface-box p {
  margin: 0;
  font-size: 14px;
  text-align: center;
}
</style>
