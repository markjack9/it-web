<template>
  <div>
    <el-card class="host-card-statistic">
      <el-button type="primary" @click="createinterface = true; generateinterface()" :disabled="!selectedSwitch">查看当前端口连接图</el-button>
      <el-dialog
          v-model="createinterface"
          :before-close="closedialog"
          :show-close="false"
          title="接口详情"
          width="80%"
      >

        <el-button @click="createinterface = false">关闭窗口</el-button>
        <div v-if="selectswitchname" class="switch-title">
          <h3>100.100.{{ selectswitchname }}</h3>
        </div>
        <div ref="dialogContent" style="min-height: 200px;">
          <el-tabs>
            <el-tab-pane>
              <el-row :gutter="20">
                <el-col
                    v-for="(item, index) in paginatedData"
                    :key="index"
                    :span="4"
                    style="margin-bottom: 20px;"
                >
                  <el-card class="status-card">
                    <div class="status-content">
                      <!-- 网口信息和状态图标 -->
                      <div class="info-row">
                        <div class="interface-info">{{ item.Interface }}</div>
                        <div class="status-icon">
                          <el-switch
                              v-model="item.switchState"
                              :disabled="true"
                              active-color="#13ce66"
                              inactive-color="#ff4949"
                              size="small"
                          />
                          <p class="status-text">状态</p>
                        </div>
                      </div>

                      <!-- 类型和网段信息 -->
                      <div class="additional-info">
                        <p>类型: {{ item.LinkType }}</p>
                        <div class="pvid-info">
                          网段: {{ item.PVID }}
                        </div>
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
        </div>
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
        <div v-if="selectswitchnamepology" class="switch-title">
          <h3>100.100.{{ selectswitchnamepology }}</h3>
        </div>
        <div ref="dialogContent" style="min-height: 200px;">
        <div ref="networkContainer" style="width: 100%; height: 600px; margin-top: 10px;"></div>
        </div>
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
const selectswitchname = ref("")
const selectswitchnamepology = ref("")
const createtopology = ref(false);
const createinterface = ref(false);
const networkContainer = ref<HTMLDivElement | null>(null);
const switchtotallist = reactive<{ switchname: string, switchnumber: number, floor: string }[]>([]);
const selectedSwitch = ref<{ switchname: string, switchnumber: number, floor: string } | null>(null);
const activeTab = ref("5"); // 当前活动的 Tab 页
const interfaceData = ref([]); // 存储接口获取的数据
const currentPage = ref(1); // 当前页码
const itemsPerPage = 28; // 每页显示的条数
const dialogContent = ref(null);
const item = {
  Interface: 'eth0',
  LinkType: 'Access',
  PHY: 'up', // 假设这是接口返回的数据
  PVID: '100'
};
// 页码切换时触发
const switchPage = (newPage) => {
  currentPage.value = newPage;
};
const loadingCard = ref(null);
// 计算分页后的数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  // 在分页时为每个 item 计算开关状态
  return interfaceData.value.slice(start, end).map(item => {
    return {
      ...item,
      switchState: item.PHY === 'up' || item.PHY === 'connected' // 动态计算开关状态
    };
  });
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
const loadingInstance = ref<any>(null);
const startLoading = () => {
  // 在打开对话框时启动加载动画
  loadingInstance.value = ElLoading.service({
    target: dialogContent.value,
    lock: true,
    text: '加载中...',
    background: 'rgba(255, 255, 255, 0.7)',
  });
};

const stopLoading = () => {
  if (loadingInstance.value) {
    loadingInstance.value.close();
  }
};
const generateTopology = async () => {

  selectswitchnamepology.value = selectedSwitch.value.switchname
  startLoading();
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
    stopLoading();
  } catch (error) {
    console.error("请求数据失败:", error);
    stopLoading()
  }
};
const generateinterface = async () => {
  selectswitchname.value = selectedSwitch.value.switchname
  startLoading();
  if (!selectedSwitch.value) {
    console.error("请先选择一个交换机！");
    return;
  }

  const response = await axios.post('http://192.168.8.84:8081/selectinterfacedetail', {
    switchname: selectedSwitch.value.switchname,
  });
  interfaceData.value = response.data.data
  stopLoading();
};
const closedialog = () => {
  stopLoading();
  createinterface.value = false;
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
  width: 60px;
  height: 60px;
  margin-bottom: 5px;
}
.switch-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* 确保内容占满整个容器的高度 */
  font-size: 14px;
  font-weight: bold;
  text-align: center; /* 确保文本在水平方向也居中 */
  line-height: 1.2; /* 调整行高，确保文本不会太密集 */
}
.switch-card.is-selected {
  box-shadow: 0 0 10px #409EFF;
  border: 2px solid #409EFF;
}

.interface-box p {
  margin: 3px 0; /* 减少段落之间的间距 */
  font-weight: bold;
  color: #333;
}
.status-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.status-card {
  background-color: #4682B4;
  border-radius: 10px; /* 缩小圆角 */
  padding: 6px; /* 缩小卡片内边距 */
  text-align: center;
  color: white;
}

.status-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.interface-info {
  font-size: 16px; /* 缩小字体 */
  font-weight: bold;
}

.status-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.status-text {
  margin-top: 4px;
  font-size: 12px;
  color: #666;
}
.additional-info {
  font-size: 14px; /* 缩小其他信息的字体 */
}

.additional-info p {
  margin: 5px 0; /* 减少段落之间的间距 */
}
.status-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 左对齐内容 */
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 4px; /* 增加间距 */
}

.interface-info {
  font-size: 20px;
  font-weight: bold;
}

.status-icon {
  margin-left: auto;
}

.additional-info {
  font-size: 14px;
  text-align: left;
  margin-top: 0px;
}

.additional-info p {
  margin: 0 0;
}

.pvid-info {
  font-size: 14px;
  margin-top: 2px;
  font-weight: bold;
}

.el-card {
  padding: 0px;
}

.el-row {
  margin-bottom: 10px;
}
</style>
