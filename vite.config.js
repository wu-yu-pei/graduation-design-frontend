import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import Pages from 'vite-plugin-pages';
import Layouts from 'vite-plugin-vue-layouts';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

import logPlugin from './src/plugin/log';

import Unocss from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({}),
    Pages({}),
    Unocss(),
    Layouts(),
    AutoImport({
      include: [/\.vue$/],
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    logPlugin(),
  ],
  server: {
    port: 5174,
    open: true,
    http: true,
    ssr: false,
    // 设置代理
    proxy: {
      '/api': {
        target: 'https://api.super-project.wuyupei.top/api/',
        secure: false,
        changeOrigin: true,
        rewrite: (path) =>  {
          console.log(path, path.replace(/^\/api/, ''))
          return path.replace(/^\/api/, '')
        },
      },
    },
  },
});
