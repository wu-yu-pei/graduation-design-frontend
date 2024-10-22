import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import Pages from 'vite-plugin-pages';
import Layouts from 'vite-plugin-vue-layouts';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

import logPlugin from './src/plugin/log';

import Unocss from 'unocss/vite';
import postcsspxtoviewport from 'postcss-px-to-viewport';
import { visualizer } from 'rollup-plugin-visualizer';
import cdn, { autoComplete } from 'vite-plugin-cdn-import';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({}),
    visualizer({
      emitFile: false,
      file: "stats.html", //分析图生成的文件名
      open: true //如果存在本地服务端口，将在打包后自动展示
    }),
    cdn({
      modules:[autoComplete('axios'), autoComplete('vue'), autoComplete('vue-router'), {
        name:'vant',
        var:'vant',
        css:'https://cdn.jsdelivr.net/npm/vant@4.9.8/lib/index.min.css',
        path: 'https://cdn.jsdelivr.net/npm/vant@4.9.8/lib/vant.min.js'
      },{
        name:'nprogress',
        var:'nprogress',
        css: "https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.css",
        path: "https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.js"
      }],
    }),
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
  css: {
    postcss: {
      plugins: [
        postcsspxtoviewport({
          unitToConvert: 'px', // 要转化的单位
          viewportWidth: 350, // UI设计稿的宽度
          unitPrecision: 6, // 转换后的精度，即小数点位数
          propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
          viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
          fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
          selectorBlackList: ['ignore-'], // 指定不转换为视窗单位的类名，
          minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
          mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
          replace: true, // 是否转换后直接更换属性值
          // exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
          exclude: [],
          landscape: false // 是否处理横屏情况
        })
      ]
    }
  },
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
        rewrite: (path) => {
          console.log(path, path.replace(/^\/api/, ''))
          return path.replace(/^\/api/, '')
        },
      },
    },
  },
});
