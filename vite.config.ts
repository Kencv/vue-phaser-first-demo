import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, '../src'),
      },
      {
        find: 'assets',
        replacement: resolve(__dirname, '../src/assets'),
      },
      {
        find: 'vue-i18n',
        replacement: 'vue-i18n/dist/vue-i18n.cjs.js', // Resolve the i18n warning issue
      },
      {
        find: 'vue',
        replacement: 'vue/dist/vue.esm-bundler.js', // compile template
      },
    ],
    extensions: ['.ts', '.js'],
  },
  define: {
    'process.env': {},
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve(
            'src/assets/style/breakpoint.less'
          )}";`,
        },
        javascriptEnabled: true,
      },
    },
  },

  // server: {
  //   // port: 8080,
  //   proxy: {
  //     '/dev': {
  //       target: 'http://192.168.0.28:30010',
  //       // target: 'http://192.168.0.2:30010',
  //       changeOrigin: true,
  //       secure: true,
  //       rewrite: (path) => path.replace(/^\/dev/, ''),
  //     },
  //     '/aMapService': {
  //       target: 'https://restapi.amap.com',
  //       changeOrigin: true,
  //       secure: true,
  //       rewrite: (path) => path.replace(/^\/aMapService/, ''),
  //     },
  //   },
  // },
});
