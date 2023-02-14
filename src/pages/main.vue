<template>
  <div class="index">
    <el-container>
      <el-aside width="200px">
        <AsideHeader></AsideHeader>
        <AsideBody></AsideBody>
      </el-aside>
      <el-container>
        <el-header>
          <HeaderLeft></HeaderLeft>
          <HeaderRight></HeaderRight>
        </el-header>
        <Tab></Tab>
        <el-main>
          <router-view #default="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>

<script setup></script>

<style scoped lang="less">
.index {
  width: 100%;
  height: 100%;
}
.el-container {
  width: 100%;
  height: 100%;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dcdfe6;
}
.el-main {
  border-top: 1px solid #dcdfe6;
}
</style>
