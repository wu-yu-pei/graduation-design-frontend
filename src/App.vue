<template>
  <router-view></router-view>
</template>

<script setup>
import { useRouter } from 'vue-router';
import useAppStore from './store/app';

const router = useRouter();
const appStore = useAppStore();
if (!appStore.token) {
  router.replace('/login');
}
</script>
