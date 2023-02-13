<template>
  <div class="title">
    <slot></slot>
  </div>
</template>

<script setup></script>

<style scoped lang="less">
.title {
  position: relative;
  padding-left: 10px;
  letter-spacing: 5px;
  font-weight: bold;
  color: blue;
  &::after {
    position: absolute;
    content: '';
    display: block;
    width: 5px;
    height: 20px;
    top: 50%;
    left: 0;
    transform: translate(0, -50%);
    background-color: blue;
  }
}
</style>
