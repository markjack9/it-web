<template>
    <div class="g-context-dashboard">
        <div>
            <el-card class="box-card g-card">
                <el-text class="network-text">系统信息</el-text>
                <el-scrollbar height="400px">
                    <pre class="preclass">{{ systeminfo }}</pre>
                </el-scrollbar>
            </el-card>
        </div>
        <div class="dashboard-card">
            <el-card class="g-cadashboard ">
                <div id="cpubashboard">
                    <div class="demo-progress">
                        <el-progress type="dashboard" :percentage="cpu" :color="colors"/>
                        <div class="dashboard-text">
                            CPU
                        </div>
                    </div>
                </div>
            </el-card>
            <el-card class="g-cadashboard ">
                <div id="cpubashboard">
                    <div class="demo-progress">
                        <el-progress type="dashboard" :percentage="mp" :color="colors"/>
                        <div class="dashboard-text">
                            内存
                        </div>
                    </div>
                </div>
            </el-card>
            <el-card class="g-cadashboard ">
                <div id="cpubashboard">
                    <div class="demo-progress">
                        <el-progress type="dashboard" :percentage="fdp" :color="colors"/>
                        <div class="dashboard-text">
                            系统磁盘
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
    <div class="progress-network">
        <el-card class="progress-card">
            <div class="network-text">
                <el-text class="network-text" size="large">流量统计</el-text>
            </div>

            <el-progress class="progress-style"
                    :text-inside="true"
                    :stroke-width="30"
                    :percentage="totalflowp"
                    :color="colors"
            >
                <span class="network-info">{{totalflow}}{{ totalflowunitstr }}/{{speednetwork}}GB</span>
            </el-progress>
        </el-card>
    </div>
    <div class="speed-card">
            <el-text class="speed-text">上传速率 {{ uns }}{{speedunit}}</el-text>
            <el-text class="speed-text">下载速率 {{ dns }}{{ speedunit }}</el-text>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import * as echarts from 'echarts/core';
import {TooltipComponent, TooltipComponentOption} from 'echarts/components';
import {GaugeChart, GaugeSeriesOption} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';
import axios from "axios";


echarts.use([TooltipComponent, GaugeChart, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<
    TooltipComponentOption | GaugeSeriesOption
>;
const systeminfo=ref("")
let totalflow = ref(0)
let totalflowp = ref(1)
let totalflowdns = 0
let totalflowuns = 0
let totalflowunitstr = "MB"
const mp = ref(0)
const cpu = ref(0)
const uns = ref(0)
const fdp = ref(0)
const dns = ref(0)
let speedunit = "KB/s"
const speednetwork = ref(500)
const reflushtime = ref(5000)

const colors = [
    {color: '#47c906', percentage: 20},
    {color: '#0fecec', percentage: 40},
    {color: '#ecbb22', percentage: 60},
    {color: '#930de8', percentage: 80},
    {color: '#ff0000', percentage: 100},
]
const serverinfo = () => {
  axios.post('http://192.168.0.117:8081/clientdata', {
    parametertype: "systeminfoget",
    clientparame: {
      optionip: "192.168.0.117",
    }
  }).then((res) => {
    systeminfo.value = res.data.data
  }).catch(function (error) {
    // handle error
    console.log(error);
  });
}

onMounted(() => {
  serverinfo()
    setInterval(() => {
      axios.post('http://192.168.0.117:8081/systemview', {
        parametertype: "cpu"
      }).then((res) => {
        cpu.value = Number(res.data.data)
      }).catch(function (error) {
        // handle error
        console.log(error);
      });
      axios.post('http://192.168.0.117:8081/systemview', {
        parametertype: "mp"
      }).then((res) => {
        mp.value = Number(res.data.data)
      }).catch(function (error) {
        // handle error
        console.log(error);
      });
      axios.post('http://192.168.0.117:8081/systemview', {
        parametertype: "fdp"
      }).then((res) => {
        fdp.value = Number(res.data.data)
      }).catch(function (error) {
        // handle error
        console.log(error);
      });
        axios.post('http://192.168.0.117:8081/systemview', {
            parametertype: "uns"
        }).then((res) => {
            uns.value = Number(res.data.data)

            if (uns.value > 1024) {
                uns.value =  Number((uns.value / 1024).toFixed(2))
                 totalflowuns =  dns.value
                speedunit = "MB/s"

            } else {
                speedunit = "KB/s"
                totalflowuns =  Number((uns.value / 1024).toFixed(2))

            }
        }).catch(function (error) {
            // handle error
            console.log(error);
        });
        axios.post('http://192.168.0.117:8081/systemview', {
            parametertype: "dns"
        }).then((res) => {
            dns.value = Number(res.data.data)

            if (dns.value > 1024) {
                dns.value =  Number((dns.value / 1024).toFixed(2))
                speedunit = "MB/s"

                totalflowdns =  dns.value
            } else {
                speedunit = "KB/s"
               totalflowdns = Number((dns.value / 1024).toFixed(2))
            }
        }).catch(function (error) {
            // handle error
            console.log(error);
        });
        let totalflowsec =  totalflowdns + totalflowuns

        if (totalflowunitstr === "MB") {
            totalflow.value = totalflow.value + totalflowsec
        } else if (totalflowunitstr === "GB"){

            totalflowsec =  totalflowsec /1024
            totalflow.value = totalflow.value + totalflowsec

        }
        if (totalflow.value > 1024 && totalflowunitstr === "MB" ) {
            totalflowunitstr = "GB"
            totalflow.value = totalflow.value /1024
            totalflowp.value = totalflow.value / speednetwork.value

        } else if (totalflow.value < 1024 && totalflowunitstr === "MB" ) {
            totalflowp.value = totalflow.value / (speednetwork.value * 1024)

        }

    }, reflushtime.value)
})
</script>

<style scoped>

.preclass{
  font-size: 14px;
  font-family: initial;
}


.network-text{
  font-size: 20px;
}

.speed-text {
font-size: 20px;
    margin: 20px 20px 20px 0px;
}
.speed-card{
    margin: 20px 20px 20px 0px;
    display: flex;
    flex-direction: row;
    overflow: auto;
    width: 93%;
    border: 1px solid beige;
    justify-content: space-around;
}

.progress-network {
    margin: 20px 20px 20px 0px;
    display: flex;
    flex-direction: column;
    overflow: auto;
    width: 93%;
}

.g-card {
    width: 600px;
    height: 200px;
    overflow: auto;
}

.g-context-dashboard {
    display: flex;
    width: 100%;
    overflow: auto;
}

.g-cadashboard {
    margin-left: 10px;
}

.dashboard-text {
    display: flex;
    justify-content: center;
    font-size: 20px;
}

.g-context-dashboard .dashboard-card {
    display: flex;
    margin-left: 20px;
}

.progress-network .network-text {
    margin-bottom: 20px;
    font-size: 24px;

}

.progress-network .network-info {
    align-items: center;
    font-size: 20px;
  color: rgba(0, 0, 0, 0.28);
}
</style>