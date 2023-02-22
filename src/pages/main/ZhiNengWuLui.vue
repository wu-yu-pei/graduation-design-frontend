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
              <div class="outher-content" v-html="item.message"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <el-input @enter="send" placeholder="请输入你的问题" v-model="question"></el-input>
      <el-button type="primary" @click="send">发送</el-button>
    </div>
  </div>
</template>
<route lang="yaml">
meta:
  name: 智能物流
</route>
<script setup>
import { useStorage } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import useAppStore from '../../store/app';
import { getInfoByid } from '../../service/home/index';

const appStore = useAppStore();
const { userInfo } = storeToRefs(appStore);
let question = ref('');

let message = useStorage('message', [{ from: 'outher', message: '你好欢迎使用智能助理: 使用方法:向我发送物流号即可例如：#23', date: 1655260176099 }], sessionStorage);

async function send() {
  question.value = question.value.trim();
  if (!question.value) {
    return alert('请输入问题');
  }
  message.value.push({
    from: 'self',
    message: question.value,
    date: +new Date(),
  });

  const tag = question.value.slice(0, 1);
  const id = question.value.slice(1);

  if (tag == '#' && /^\d*$/.test(id)) {
    const res = await getInfoByid(id);
    console.log(res.data.length);
    if (res.data.length != 0) {
      const { id, start_position, end_position, name, current_position, current_time, status } = res.data[0];
      message.value.push({
        from: 'outher',
        message: `
          物流编号：#${id}<br/>

          状态：${status == 0 ? '已完成' : status == 1 ? '运输中' : '已拦截'}<br/>
          商品名称：${name}<br/>
          发货地址：${start_position}<br/>
          收货地址：${end_position}<br/>
        `,
        date: +new Date(),
      });
    } else {
      message.value.push({
        from: 'outher',
        message: '抱歉，没有该物流信息！',
        date: +new Date(),
      });
    }
  } else {
    setTimeout(() => {
      message.value.push({
        from: 'outher',
        message: '抱歉，我只认识物流编码哦！',
        date: +new Date(),
      });
    }, 500);
  }
  question.value = '';
}
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
      overflow-y: scroll;
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
