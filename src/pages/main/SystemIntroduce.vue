<template>
  <div class="system-introduce">
    <div class="box-card">
      <Title>系统介绍</Title>
      <div class="content one">题目：基于javascript gl api实现的物流追踪系统。</div>
    </div>
    <div class="box-card">
      <Title>课题简介</Title>
      <div class="content two">
        题目：基于javascript gl api实现的物流追踪系统 <br />
        专业：计算机科学与技术 <br />
        学生姓名：吴玉配 <br />
        指导教师：赵景海 <br />
        日期：2023-1-3 <br />
        内容：随着科技的发展和人们生活质量的提高，生活中有数不胜数的物流信息，为了统一管理物流信息，为此设计了一套物流系统。系统的设计目标是基于javascript gl
        api实现一个物流发布及管理的可视化物流追踪系统，达到实时追踪物流，实时显示物流运输流向和数量分布，动态分析物流流向数据的效果。
        使用者录入信息后即可使用账号密码登陆物流追踪系统，可以对自己的所有物流数据进行统一管理，系统会把所有物流数据进行可视化展示让使用者对自己的物流有更加详细的认知。另外该系统使用过程中需要第三方物流公司配合才能达到实时的效果，本课题会设计一个专门的物流更新系统来达到实时的效果。<br />
        设计方案：<br />
        1.数据存储：使用MySQL或MongoDB数据库存储货物信息，包括货物编号、发货时间、目的地、当前位置、状态等。<br />
        2.追踪API：使用Node.js实现一个RESTful API，对外提供货物信息的获取和更新接口。<br />
        3.前端界面：使用React或Vue.js实现一个简洁的物流追踪界面，提供货物信息的实时查询和展示功能。<br />
        4.数据更新：使用Node.js实现定时任务，从物流公司的API获取最新的货物信息，并通过API更新数据库。 地图展示：使用JavaScript API
        GL在前端界面中展示货物在地图上的实时位置，提供可视化的物流追踪体验。<br />
      </div>
    </div>

    <div class="box-card">
      <Title>完成进度</Title>
      <p style="font-size: 12px; color: blue; padding-left: 10px;">共 {{allCommits.length}} 次提交</p>
      <div class="content three">
        <el-timeline>
          <template v-for="item in allCommits">
            <el-timeline-item :timestamp="item.commit.committer.date" color="rgb(11, 189, 135)" placement="top">
              <div>
                <div class="title">
                  <el-avatar :src="item.author.avatar_url" />
                  <h4>{{ item.commit.author.name }}</h4>
                </div>
                <p>提交了代码，并备注：{{ item.commit.message }}</p>
              </div>
            </el-timeline-item>
          </template>
        </el-timeline>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  name: 系统介绍
</route>

<script setup>
import { useDateFormat } from '@vueuse/core';
import axios from 'axios';

let allCommits = ref();
axios.get('https://api.github.com/repos/wu-yu-pei/graduation-design-frontend/commits').then((res) => {
  allCommits.value = res.data;
  allCommits.value.forEach((item) => {
    item.commit.committer.date = useDateFormat(item.commit.committer.date, 'YYYY-MM-DD HH:mm:ss');
  });
});
</script>

<style scoped lang="less">
.box-card {
  margin-bottom: 20px;
}
span {
  font-weight: bold;
}
.content {
  letter-spacing: 2px;
  padding-left: 10px;
  margin-bottom: 40px;
  margin-top: 20px;
}
.two {
  line-height: 35px;
}
.three {
  .el-timeline {
    padding-left: 0;
  }
  .el-avatar {
    border: 1px solid #ccc;
  }
  .title {
    display: flex;
    align-items: center;
    gap: 0 10px;
  }
  p {
    padding-left: 50px;
  }
}
</style>
