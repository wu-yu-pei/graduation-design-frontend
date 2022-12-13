<template>
  <div>登录页面</div>
  <div>{{ isHidden ? phone : hiddenDate(phone) }}</div>
  <div>{{ isHidden ? card : hiddenDate(card) }}</div>
  <button @click="() => (isHidden = !isHidden)">切换</button>
</template>

<script setup>
import { login, findShop } from '../service/home';
login({ account: 0, password: 0 }).then((res) => {
  localStorage.setItem('token', res.data.token);
});

let isHidden = ref(false);
const phone = '18383823927';
const card = '414323200111014435';
const hiddenPhoen = computed(() => {
  return phone.slice(0, 4) + '******' + phone.slice(-4);
});

function hiddenDate(data) {
  if (data.length == 11) {
    return data.slice(0, 4) + '******' + data.slice(-4);
  } else {
    return data.slice(0, 4) + '*************' + data.slice(-4);
  }
}
</script>

<style scoped></style>
