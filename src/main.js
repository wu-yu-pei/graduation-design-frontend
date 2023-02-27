import { createApp } from 'vue';
import App from './App.vue';

//  global css
import './assets/css/index.css';

// progress
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'

// unocss
import 'uno.css';

// normalize.css
import 'normalize.css';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

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

router.beforeEach(() => {
  NProgress.start();
});
router.afterEach(() => {
  NProgress.done();
});

const app = createApp(App);
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(pinia);
app.use(router);
app.mount('#app');
