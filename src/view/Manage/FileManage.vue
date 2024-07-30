<template>
  <div class="logsetting">
    <div>
      <el-card class="log-card-statistic">
        <el-upload
            class="upload-demo"
            drag
            action="http://192.168.0.117:8081/upload"
            multiple
            :on-success="filelist"

        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            拖拽文件至此 或者<em>点击上传文件</em>
          </div>

          <template #tip>
            <div class="el-upload__tip">
             文件最大上传为500M
            </div>

          </template>

        </el-upload>
        </el-card>
      <el-card class="log-card-statistic">
        <el-button @click="toggleSelection()">取消勾选</el-button>
        <el-button @click="deletefile()">删除</el-button>
        <el-button @click="filelist()">刷新</el-button>
        <el-button @click="downloadfile()">下载</el-button>
        <el-table
            ref="multipleTableRef"
            :data="tableData"
            style="width: 100%"
            class="host-card-list"
            @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"/>
          <el-table-column label="文件id" width="120">
            <template #default="scope">{{ scope.row.fileid }}</template>
          </el-table-column>
          <el-table-column prop="filename" align="center"  label="文件名称" width="120" show-overflow-tooltip/>
          <el-table-column prop="filesize" align="center"  label="文件大小" width="120"/>
          <el-table-column prop="filedir" align="center"  label="文件路径" width="120" show-overflow-tooltip/>
          <el-table-column prop="uploadtime" align="center"  label="上传时间" width="120"/>
        </el-table>
      </el-card>

    </div>
    <div></div>
  </div>


</template>

<script lang="ts" setup>
import { UploadFilled } from '@element-plus/icons-vue'
import {onMounted, ref} from "vue";
import {ElTable} from "element-plus";
import axios from 'axios';

interface Filelog {
  fileid: number
  filename: string
  filesize: number
  filedir: string
  uploadtime: string
}
let form: Filelog
const isselect = ref(false)
const tableData = ref<Filelog[]>([])
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<Filelog[]>([])
const toggleSelection = (rows?: Filelog[]) => {
  if (rows) {
    multipleTableRef.value!.toggleAllSelection()
  } else {
    multipleTableRef.value!.clearSelection()
    isselect.value = false

  }
}
onMounted(() => {
 filelist()
})
const handleSelectionChange = (val: Filelog[]) => {
  multipleSelection.value = val
form = val[0]
  isselect.value = true
}
const downloadfile= () => {
  axios.post('http://192.168.0.117:8081/download', {

    filelog: {
      fileid: form.fileid
    },
  },{responseType:'blob'}).then((res) => {
  const link = document.createElement('a');
    let fileblob = new Blob([res.data],{
      type: 'application/octet-stream'
    })
    console.log(fileblob)
  const url = window.URL.createObjectURL(fileblob);
  link.href = url;
  link.download = form.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
    });
  }
const deletefile= () => {
  axios.post('http://192.168.0.117:8081/crontab', {
    parameoption: "fileremove",
    filelog: {
      fileid: form.fileid
    }

  }).then((res) => {
    if (res.data.code === 1000) {
      console.log('success')
      filelist()
    } else {
      console.log(res.data.message)
    }

  }).catch(function (error) {
    console.log("错误信息", error)
  });
}
const filelist = () => {
  axios.post('http://192.168.0.117:8081/crontab', {
    parameoption: "logmsgfile"
  }).then((res) => {
    if (res.data.code === 1000) {
      console.log('success')
      tableData.value = res.data.data
    } else {
      console.log(res.data.message)
    }

  }).catch(function (error) {
    console.log("错误信息", error)
  });
}

</script>

<style scoped>
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
</style>