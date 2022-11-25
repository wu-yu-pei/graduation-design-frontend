import { createApp } from 'vue';
import App from './App.vue';

//  全局 css
import './assets/css/index.css'

// unocss
import 'uno.css';

// normalize.css
import 'normalize.css'

// router and layouts
import generatedRoutes from '~pages';
import { createRouter, createWebHistory } from 'vue-router';
import { setupLayouts } from 'virtual:generated-layouts';

// pinia
import pinia from './store';

const routes = setupLayouts(generatedRoutes);
const router = createRouter({
  routes,
  history: createWebHistory(),
});

createApp(App).use(pinia).use(router).mount('#app');