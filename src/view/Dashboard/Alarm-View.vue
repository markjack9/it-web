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
                      会议室总数
                    </div>
                  </template>
                </el-statistic>
                <div class="statistic-footer">
                  <div class="footer-item">
                    <span>新增数量</span>
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
                      <el-button @click="todayreadymeetroom = true;todaynotnullgetdate()">今日已巡检数量</el-button>
                      <el-dialog
                          v-model="todayreadymeetroom"
                          :show-close="false"
                          title="今日已巡检会议室"
                          style="width: 350px">
                        <el-row :gutter="20">
                          <el-col v-for="(item, index) in todaynotnullstr" :key="index" :span="8">
                            <el-card class="box-card">
                              <div slot="header" class="clearfix">
                                <span>{{ item }}</span>
                              </div>
                            </el-card>
                          </el-col>
                        </el-row>
                      </el-dialog>
                    </div>
                  </template>
                </el-statistic>
                <div class="statistic-footer">
                  <div class="footer-item">
                    <span>已巡检占比</span>
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
                      <el-button @click="todaynotreadymeetroom = true;todaynullgetdate()">今日未巡检数量</el-button>
                      <el-dialog
                          v-model="todaynotreadymeetroom"
                          :show-close="false"
                          title="今日未巡检会议室"
                          style="width: 350px">
                        <el-row :gutter="20">
                          <el-col v-for="(item, index) in todaynullstr" :key="index" :span="8">
                            <el-card class="box-card">
                              <div slot="header" class="clearfix">
                                <span>{{ item }}</span>
                              </div>
                            </el-card>
                          </el-col>
                        </el-row>
                      </el-dialog>
                    </div>
                  </template>
                </el-statistic>
                <div class="statistic-footer">
                  <div class="footer-item">
                    <span>未巡检占比</span>
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
          <el-button @click="hostlistdata()">刷新</el-button>
          <el-button @click="todoadditem = true">查看</el-button>
          <el-dialog
              v-model="todoadditem"
              :before-close="closedialog"
              :show-close="false"
              title="查询信息">
            <el-form :model="seeform" label-width="120px">
              <span class="selectabel">选择人员</span>
              <el-select
                  v-model="selectedUser"
                  placeholder="选择人员"
                  size="large"
                  style="width: 240px"
              >
                <el-option
                    v-for="item in userlist"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
              <el-form-item label="选择时间">
                <el-col :span="11">
                  <el-date-picker
                      v-model="seeform.jobstarttime"
                      type="date"
                      format="YYYY/MM/DD"
                      value-format="YYYY-MM-DD"
                      placeholder="选择时间"
                      style="width: 100%"
                  />
                </el-col>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="todoadditem = false;beforedateselect()">确定
                </el-button>
                <el-button @click="todoadditem = false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
          <el-pagination
              background
              layout="prev, pager, next, sizes, total"
              :total="tableData.length"
              :page-size="pageSize"
              :current-page="currentPage"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
          />
          <el-table
              :data="paginatedData"
              style="width: 100%"
              class="host-card-list"
          >
            <el-table-column prop="Number" label="序号" width="80" align="center" />
            <el-table-column prop="MeetRoom" label="会议室名称" width="200" align="center" />
            <el-table-column prop="MeetStatus" :formatter="statusicon" label="巡检状态" width="200" align="center" />
            <el-table-column prop="RoomIP" label="设备IP" width="200" align="center" />
            <el-table-column prop="MeetOwner" label="巡检人员" width="200" align="center" />
            <el-table-column prop="StartTime" label="巡检时间" width="200" align="center" />
            <el-table-column prop="Note" label="巡检记录" width="200" align="center" />
          </el-table>
          <el-pagination
              background
              layout="prev, pager, next, sizes, total"
              :total="tableData.length"
              :page-size="pageSize"
              :current-page="currentPage"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
          />
        </el-card>
        <el-button
            class="scroll-to-top"
            type="primary"
            circle
            @click="scrollToTop"
        >
          <div class="scroll-content">
            <i class="el-icon-arrow-up"></i>
            <span>返回顶部</span>
          </div>
        </el-button>

      </div>

    </div>

  </div>



</template>

<script lang="ts" setup>
import {
  CaretBottom,
  CaretTop,
} from '@element-plus/icons-vue'
import {
  ElIcon,
} from 'element-plus'


import {onMounted, computed,reactive, onBeforeUnmount,ref} from 'vue'
import { ElTable } from 'element-plus'
import axios from 'axios';
interface meetroomdate {
  Number: number
  MeetRoom: string
  MeetStatus: string
  RoomIP: string
  MeetOwner: string
  StartTime: string
  Note: string
}
interface User {
  value: number
  label: string
}
const pageSize = ref(25); // 每页显示的条数
const currentPage = ref(1); // 当前页码
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});
const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize;
};
const showScrollTop = ref(false);

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 200;
};

const scrollToTop = (): void => {
  const container = document.querySelector('.host-statistics') as HTMLElement;
  if (container) {
    container.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  } else {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
};

onMounted(() => {
  const container = document.querySelector('.host-statistics') as HTMLElement;
  if (container) {
    container.addEventListener('scroll', handleScroll);
  } else {
    window.addEventListener('scroll', handleScroll);
  }
});

onBeforeUnmount(() => {
  const container = document.querySelector('.host-statistics') as HTMLElement;
  if (container) {
    container.removeEventListener('scroll', handleScroll);
  } else {
    window.removeEventListener('scroll', handleScroll);
  }
});

// 处理页码变化
const handleCurrentChange = (newPage: number) => {
  currentPage.value = newPage;
};

// 状态图标格式化
const todaynotreadymeetroom = ref(false)
const userlist = ref<User[]>([
  { value: 5289, label: '闫秀宝' },
  { value: 785, label: '王毅' },
  { value: 3721, label: '张周阳' },
  { value: 1, label: '全部' }
]);

// 选择的用户
const selectedUser = ref<number | null>(null as number | null);

// 获取用户名称
function getUserName(value: number | null): string {
  const user = userlist.value.find(item => item.value === value);
  return user ? user.label : '未知';
}


const closedialog = (done) => {
  toggleSelection()
  done();
}
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const toggleSelection = (rows?: meetroomdate[]) => {
  if (rows) {
    multipleTableRef.value!.toggleAllSelection()
  } else {
    multipleTableRef.value!.clearSelection()

  }
}
const seeform =  reactive({
  jobid: "",
  jobname: "",
  jobstatus: 0,
  jobcronexpr: "",
  jobstarttime: "",
  jobshell: "",
})
const todayreadymeetroom = ref(false)
const hosttotal = ref(24)
const hostonline = ref(0)
const  hostoffline = ref(0)
const addhosttotal = ref(0)
const onlinerate = ref(0)
const offlinerate = ref(0)
const todoadditem = ref(false)
const tableData = ref<meetroomdate[]>([])
const todaynotnullstr = ref([])
const todaynullstr = ref([])

const beforedate = ref (getCurrentFormattedTime())
onMounted(() => {
  hostlistdata()
  hoststatistics()

})
const statusicon = (row)=> {
  if (row.MeetStatus === "正常") {
    return '正常'
  } else  {
    return '异常'
  }
}
const hoststatistics = () => {

  axios.get('http://192.168.8.116:8080/GetInspected').then(
      reponse => {
        hostonline.value = reponse.data.data;
        hostoffline.value = 24 - hostonline.value
        onlinerate.value = Math.round((hostonline.value / 24) * 100)
        offlinerate.value = Math.round((hostoffline.value / 24) * 100)
      },
      error => {
        console.log("请求数据失败了:", error.message)
      });

}
function padStart(value: string | number, targetLength: number, padString: string = '0'): string {
  let str = String(value);
  while (str.length < targetLength) {
    str = padString + str;
  }
  return str;
}
function getCurrentFormattedTime(): string {
  const now = new Date(); // 获取当前时间
  now.setDate(now.getDate() - 1);
  const year = now.getFullYear(); // 获取年份
  const month = padStart(now.getMonth() + 1, 2); // 获取月份，并补零
  const day = padStart(now.getDate(), 2); // 获取日期，并补零
  const hours = padStart(now.getHours(), 2); // 获取小时，并补零
  const minutes = padStart(now.getMinutes(), 2); // 获取分钟，并补零
  const seconds = padStart(now.getSeconds(), 2); // 获取秒数，并补零

  // 拼接成所需的格式：YYYY-MM-DD%
  return `${year}-${month}-${day}%`;
}

function addpercent(datestr: string): string {
  // 验证输入是否为空或不符合日期格式
  const defaultDate = '%';
  if (!datestr || typeof datestr !== 'string') {
    datestr = defaultDate;
  }

  // 在日期字符串后添加 '%' 符号
  return datestr.trim() + '%';
}
const hostlistdata = () => {
  axios.post('http://192.168.8.116:8080/DateBefore', {
    option: "before",
    selectdate: {
      timestring: beforedate.value,
      userid: 1,

    }
  }).then(
      reponse => {
        console.log("请求数据成功")
        tableData.value = reponse.data.data;
      },
      error => {
        console.log("请求数据失败了:", error.message)
      });
}

const beforedateselect = () => {
  axios.post('http://192.168.8.116:8080/DateBefore', {
    option: "before",
    selectdate: {
      timestring: addpercent(seeform.jobstarttime),
      userid: selectedUser.value,
    }
  }).then(
      reponse => {
        console.log("请求数据成功")
        tableData.value = reponse.data.data;
      },
      error => {
        console.log("请求数据失败了:", error.message)
      });
}

const todaynullgetdate = () => {
  axios.post('http://192.168.8.116:8080/GetTodayMeetroom', {
    option: "todaynull",
  }).then(
      reponse => {
        console.log("请求数据成功")
        todaynullstr.value = reponse.data.data.flat();
      },
      error => {
        console.log("请求数据失败了:", error.message)
      });
}
const todaynotnullgetdate = () => {
  axios.post('http://192.168.8.116:8080/GetTodayMeetroom', {
    option: "today",
  }).then(
      reponse => {
        console.log("请求数据成功")
        todaynotnullstr.value = reponse.data.data.flat();
      },
      error => {
        console.log("请求数据失败了:", error.message)
      });
}

</script>

<style scoped>
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.selectabel {
  margin-left: 52px;
  display: inline-flex;
  justify-content: flex-end;
  align-items: flex-start;
  flex: 0 0 auto;
  font-size: var(--el-form-label-font-size);
  color: var(--el-text-color-regular);
  height: 32px;
  line-height: 32px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
}
.el-statistic {
  --el-statistic-content-font-size: 28px;
}
.host-card-list {
  width: 100%;
}
.host-statistics {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
}
.host-card {
  width: 90%;
  margin-top: 20px;
  margin-bottom: 50px; /* 增加底部空白，确保分页和浏览器底部有足够的距离 */
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 为整个区域添加阴影，提升视觉层次感 */
}

.host-card-list {
  margin-bottom: 20px; /* 在表格和分页控件之间增加空白 */
  background-color: #f9f9f9; /* 背景颜色为浅色，确保表格的可读性 */
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1); /* 表格的阴影，让其更突出 */
}

.el-pagination {
  padding: 10px;
  border-top: 1px solid #ebeef5;
  background-color: #fff; /* 确保分页控件的背景色与整体风格一致 */
  border-radius: 8px;
}

.container {
  padding: 20px;
  margin-bottom: 50px; /* 确保底部有足够的空间 */
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
.scroll-to-top {
  position: fixed;
  bottom: 50px;
  right: 50px;
  z-index: 1000;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  background-color: #409EFF;
  color: #fff;
  border-radius: 50%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.scroll-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.scroll-content i {
  font-size: 20px;
}

.scroll-content span {
  font-size: 12px;
  margin-top: 4px;
}

.scroll-to-top:hover {
  background-color: #66b1ff;
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