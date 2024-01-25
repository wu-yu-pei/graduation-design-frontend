<template>
  <div class="my-shops">
    <Title>
      <div class="left">我的商品</div>
      <div class="right">
        <el-upload ref="upload" class="upload" :limit="1" :auto-upload="false" :on-remove="fileRemove" :on-change="fileChange">
          <template #trigger>
            <el-button>导入</el-button>
          </template>
        </el-upload>
        <el-button type="primary" v-if="file" v-loading="isLoading" @click="sure">确定</el-button>
      </div>
    </Title>
    <div class="body">
      <el-table :data="allThings" border stripe style="width: 100%" v-loading="allThings == null">
        <el-table-column prop="id" label="id" width="180" />
        <el-table-column prop="name" label="商品名称" width="180" />
        <el-table-column prop="total" label="现有库存" width="180" />
        <el-table-column prop="price" label="价格" width="180" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" @click="toEdit(scope.row.id)">编辑</el-button>
            <el-button type="danger" @click="remoteById(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="isEdit" title="编辑" width="30%" :before-close="handleClose">
      <el-form :inline="true" :model="currentInfo" class="demo-form-inline">
        <el-form-item label="商品名称">
          <el-input v-model="currentInfo.name" placeholder="Approved by" />
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="currentInfo.price" placeholder="Approved by" />
        </el-form-item>
        <el-form-item label="现有库存">
          <el-input v-model="currentInfo.total" placeholder="Approved by" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isEdit = false">取消</el-button>
          <el-button type="primary" @click="edit()"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<route lang="yaml">
meta:
  name: 我的商品
</route>

<script setup>
import ExcelJS, { async } from 'exceljs/dist/exceljs';
import 'exceljs/dist/exceljs.bare';

import { createThings, getAllThings, deleteOneThing, changeOneThing } from '../../service/home/index';
import useAppStore from '../../store/app';
const appStore = useAppStore();
// 1.0 商品列表
const allThings = ref(null);
async function getList() {
  let res = await getAllThings(appStore.userInfo.id);
  allThings.value = res.data.data;
}
getList();

// 2.0 导入
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

function fileRemove() {
  file.value = null;
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

// 3.0 删除
async function remoteById(id) {
  ElMessageBox.confirm('确定删除吗？', '删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let res = await deleteOneThing(id);
      await getList();
      ElMessage({
        type: 'success',
        message: res.data.msg,
      });
    })
    .catch(() => {});
}

// 4.0 编辑
let isEdit = ref(false);
let currentInfo = reactive({
  id: '',
  name: '',
  price: '',
  total: '',
});

function toEdit(id) {
  isEdit.value = true;
  let target = allThings.value.find((i) => i.id == id);
  for (let key in currentInfo) {
    currentInfo[key] = target[key];
  }
}

async function edit(id) {
  isEdit.value = false;
  const res = await changeOneThing(currentInfo.id, currentInfo.name, currentInfo.price, currentInfo.total);
  if (res.data.code == 200) {
    getList();
    return ElMessage({
      type: 'success',
      message: res.data.msg,
    });
  }
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
