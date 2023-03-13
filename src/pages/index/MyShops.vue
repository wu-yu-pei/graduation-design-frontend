<template>
  <div class="my-shops">
    <Title>
      <div class="left">我的商品</div>
      <div class="right">
        <el-upload ref="upload" class="upload" :auto-upload="false" :on-change="fileChange">
          <template #trigger>
            <el-button>导入</el-button>
          </template>
        </el-upload>
        <el-button type="primary" v-if="file" v-loading="isLoading" @click="sure">确定</el-button>
      </div>
    </Title>
    <div class="body">
      <el-table :data="allThings" border stripe style="width: 100%" v-loading="!allThings.length">
        <el-table-column prop="id" label="id" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="total" label="总量" width="180" />
        <el-table-column prop="count" label="现有库存" width="180" />
        <el-table-column prop="price" label="价格" width="180" />
        <el-table-column label="操作">
          <el-button>编辑</el-button>
          <el-button>删除</el-button>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  name: 我的商品
</route>

<script setup>
import ExcelJS from 'exceljs/dist/exceljs';
import 'exceljs/dist/exceljs.bare';

import { createThings, getAllThings } from '../../service/home/index';
import useAppStore from '../../store/app';
const appStore = useAppStore();
// 1.0 商品列表
const allThings = ref([]);
async function getList() {
  let res = await getAllThings(appStore.userInfo.id);
  allThings.value = res.data.data;
}
getList();
const wb = new ExcelJS.Workbook();
const upload = ref(null);
const file = ref(null);
let isLoading = ref(false);
function fileChange(e) {
  if (!e.name.endsWith('.xlsx')) {
    upload.value.clearFiles();
    return ElMessage({
      type: 'error',
      message: '文件格式不正确',
    });
  }
  file.value = e;
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (ev) => {
      resolve(ev.target.result);
    };
    reader.onerror = (err) => {
      reject(err);
    };
  });
}

async function sure() {
  isLoading.value = true;
  if (!file.value) {
    isLoading.value = false;
    return ElMessage({
      type: 'warning',
      message: '请选择文件',
    });
  }
  let buffer = await readFile(file.value.raw);
  wb.xlsx.load(buffer).then(() => {
    const ws = wb.getWorksheet('aaa');
    const A = ws.getColumn(1);
    const B = ws.getColumn(2);
    const C = ws.getColumn(3);

    const name = [];
    const price = [];
    const total = [];
    A.eachCell((c, index) => {
      if (index != 1) {
        name.push(c.value);
      }
    });
    B.eachCell((c, index) => {
      if (index != 1) {
        price.push(c.value);
      }
    });
    C.eachCell((c, index) => {
      if (index != 1) {
        total.push(c.value);
      }
    });

    createThings({ uid: appStore.userInfo.id, data: { name, price, total } }).then(async (res) => {
      if ((res.code = 200)) {
        ElMessage({
          type: 'success',
          message: '导入成功',
        });
      } else {
        ElMessage({
          type: 'error',
          message: '导入失败',
        });
      }
      await getList();
      upload.value.clearFiles();
      file.value = '';
      isLoading.value = false;
    });
  });
}
</script>

<style scoped lang="less">
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .right {
    display: flex;
    gap: 0 10px;
  }
  .upload {
    display: flex;
    flex-direction: row-reverse;
  }
}

.my-shops {
  height: 100%;
}
.body {
  height: calc(100% - 40px);
  .el-table--fit {
    max-height: 100% !important;
    overflow: scroll;
    margin-top: 10px;
  }
}
</style>
