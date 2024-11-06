<template>
  <div class="back-button" @click="goBack">
    返回
  </div>
</template>

<script>
export default {
  name: "BackButton",
  methods: {
    goBack() {
      this.$router.go(-1); // 返回上一个页面
    }
  }
};
</script>

<style scoped>
.back-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #1989fa;
  color: #fff;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;
}
.back-button:hover {
  background-color: #3a8f6d;
}
</style>
