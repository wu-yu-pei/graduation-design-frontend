<template>
  <div class="box">
    <div class="top">
      <div class="top-tip">注意:对话不保留</div>
      <div class="message">
        <div v-for="(item, index) in message">
          <div class="self" v-if="item.from == 'self'">
            <img :src="userInfo.img" alt="" />
            <div>
              <p>{{ userInfo.account }}</p>
              <div class="self-content">
                {{ item.message }}
              </div>
            </div>
          </div>
          <div v-else-if="item.type == 'date'" class="time">
            <span>{{ item.date }}</span>
          </div>
          <div class="outher" v-else>
            <img src="/image/rabbot.png" alt="" />
            <div>
              <p>智能助理</p>
              <div class="outher-content">
                {{ item.message }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <el-input placeholder="请输入你的问题" v-model="question"></el-input>
      <el-button type="primary">发送</el-button>
    </div>
  </div>
</template>
<route lang="yaml">
meta:
  name: 智能物流
</route>
<script setup>
import { storeToRefs } from 'pinia';
import useAppStore from '../../store/app';

const appStore = useAppStore();
const { userInfo } = storeToRefs(appStore);
let question = ref('');

let message = ref([{ from: 'outher', name: 'B', img: '', message: '你好欢迎使用智能助理: 你好欢迎使用智能助理', date: 1655260176099 }]);
</script>

<style scoped lang="less">
.box {
  height: 100%;
  .top {
    height: calc(100% - 60px);
    border: 1px solid #dcdfe6;
    padding: 10px 0;
    .top-tip {
      text-align: center;
      color: red;
      letter-spacing: 5px;
      font-size: 12px;
      height: 20px;
      line-height: 20px;
    }
    .message {
      height: calc(100% - 20px);
      padding: 10px;
      .self {
        display: flex;
        flex-direction: row-reverse;
        margin: 10px 0;
        img {
          width: 30px;
          height: 30px;
          margin-left: 5px;
          border-radius: 50%;
        }
        p {
          text-align: right;
          color: #ccc;
          font-size: 12px;
          margin: 0 0 2px 0;
        }
        .self-content {
          position: relative;
          border-radius: 5px;
          background: #545c64;
          padding: 6px 10px;
          max-width: 250px;
          color: #fff;
          letter-spacing: 3px;
          &::after {
            position: absolute;
            content: '';
            top: -3px;
            right: -14px;
            border: 10px solid transparent;
            border-left: 10px solid #545c64;
            transform: rotateZ(335deg);
          }
        }
      }
      .outher {
        display: flex;
        margin: 10px 0;
        img {
          width: 40px;
          height: 40px;
          margin-right: 5px;
          border-radius: 50%;
        }
        p {
          text-align: left;
          color: #ccc;
          font-size: 12px;
          margin: 0 0 2px 0;
        }
        .outher-content {
          position: relative;
          border-radius: 5px;
          background-color: #ccc;
          padding: 6px 10px;
          max-width: 250px;
          letter-spacing: 3px;
          &::after {
            position: absolute;
            content: '';
            top: -3px;
            left: -14px;
            border: 10px solid transparent;
            border-left: 10px solid #ccc;
            transform: rotateZ(214deg);
          }
        }
      }
    }
  }
  .bottom {
    display: flex;
    margin-top: 10px;
    height: 50px;
    .el-button {
      width: 100px;
      height: 50px;
      margin-left: 10px;
    }
  }
}
</style>
