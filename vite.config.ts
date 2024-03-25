import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
// import eslint from 'vite-plugin-eslint';
import { Plugin as pluginCDN } from 'vite-plugin-cdn-import';
// 导入 svg
import pluginSvgr from 'vite-plugin-svgr';
// 修改 vite.config.ts 自动重启
import pluginViteRestart from 'vite-plugin-restart';
// 打包体积视图
import { visualizer as pluginVisualizer } from 'rollup-plugin-visualizer';
// DNS 预加载
import pluginDnsPrefetch from './vite-plugins/vite-plugin-DNS-prefetch';
// CND 替换
import pluginCDNReplace from './vite-plugins/vite-plugin-CDN-replace';

const rootDir = process.cwd();

// console.log(pluginCDN, process.env.NODE_ENV);

// https://vitejs.dev/config/
export default defineConfig({
  // 需要隐藏在 path 后面的时候
  // base:'subPath',
  define: {
    'process.env': { NODE_ENV: process.env.NODE_ENV },
  },

  build: {
    // target: ['es2015', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    // cssTarget: ['chrome52', 'safari14'],
    rollupOptions: {
      external: ['@faker-js/faker'],
      output: {
        // chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
        // entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
        // assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
        // 拆分成最小单位
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // console.log(id);
            // return 'vendor';
            // const packName = id
            //   .toString()
            //   .split('node_modules/.pnpm/')[1]
            //   .split('/')[0]
            //   .toString();
            const packName = id.match(
              /\/node_modules\/\.pnpm\/(?<packName>.+?)\//
            ).groups.packName;
            // console.log(id, packName);
            return packName;
          }
        },
      },
    },
  },
  plugins: [
    // eslint(),
    pluginCDNReplace([
      {
        name: 'axios',
        module: 'axios',
        path: 'axios.min.js',
        props: ['defer'],
      },
      {
        name: 'dayjs',
        module: 'dayjs',
        path: 'dayjs.min.js',
        props: ['defer'],
      },
      // {
      //   name: 'lodash',
      //   module: 'lodash',
      //   path: 'lodash.min.js',
      // props : ['defer']
      // },
      {
        name: 'react',
        module: 'React',
        path: 'umd/react.production.min.js',
        props: ['defer'],
      },
      {
        name: 'react-dom',
        module: 'ReactDOM',
        path: 'umd/react-dom.production.min.js',
        props: ['defer'],
      },
      // {
      //   name: 'react-router-dom',
      //   module: 'ReactRouterDom',
      //   urlTemplate: 'https://unpkg.com/{name}@{version}/{path}',
      //   path: 'dist/umd/react-router-dom.production.min.js',
      //   props: ['defer'],
      // },
      // {
      //   name: 'react-hook-form',
      //   module: 'ReactHookForm',
      //   urlTemplate: 'https://cdn.jsdelivr.net/npm/{name}@{version}/{path}',
      //   path: 'dist/index.umd.min.js',
      // },
      {
        name: 'antd',
        module: 'antd',
        urlTemplate: 'https://unpkg.com/{name}@{version}/{path}',
        path: 'dist/antd.min.js',
        props: ['defer'],
      },
      {
        name: 'zod',
        module: 'Zod',
        urlTemplate: 'https://unpkg.com/{name}@{version}/{path}',
        path: 'lib/index.umd.js',
        props: ['defer'],
      },
      {
        name: '@ant-design/icons',
        module: 'icons',
        // urlTemplate: 'https://cdn.jsdelivr.net/npm/{name}@{version}/{path}',
        // path: 'dist/index.umd.min.js',
        urlTemplate: 'https://unpkg.com/{name}@{version}/{path}',
        path: 'dist/index.umd.min.js',
        props: ['defer'],
      },
      {
        name: '@ant-design/plots',
        module: 'Plots',
        // urlTemplate: 'https://cdn.jsdelivr.net/npm/{name}@{version}/{path}',
        // path: 'dist/plots.min.js',
        urlTemplate: 'https://unpkg.com/{name}@{version}/{path}',
        path: 'dist/plots.min.js',
        props: ['defer'],
      },
    ]),
    pluginSvgr(),
    // pluginCDN({
    //   // https://unpkg.com/browse/*
    //   // https://www.jsdelivr.com/?query=*
    //   // https://cdnjs.com/libraries?q=*
    //   prodUrl: 'https://cdnjs.cloudflare.com/ajax/libs/{name}/{version}/{path}',
    //   modules: [
    //     {
    //       name: 'axios',
    //       var: 'axios',
    //       path: 'axios.min.js',
    //     },
    //     {
    //       name: 'react',
    //       var: 'React',
    //       path: 'umd/react.production.min.js',
    //     },
    //     {
    //       name: 'react-dom',
    //       var: 'ReactDOM',
    //       path: 'umd/react-dom.production.min.js',
    //     },
    //     // {
    //     //   name: 'react-router-dom',
    //     //   var: 'ReactRouterDOM',
    //     //   path: 'https://unpkg.com/react-router-dom@6.9.0/dist/umd/react-router-dom.production.min.js',
    //     // },
    //     {
    //       name: 'dayjs',
    //       var: 'dayjs',
    //       path: 'dayjs.min.js',
    //     },
    //     {
    //       name: 'antd',
    //       var: 'antd',
    //       path: 'antd.min.js',
    //     },
    //     {
    //       name: '@ant-design/icons',
    //       var: 'icons',
    //       path: 'https://cdn.jsdelivr.net/npm/@ant-design/icons@5.0.1/dist/index.umd.min.js',
    //     },
    //     {
    //       name: '@ant-design/plots',
    //       var: 'Plots',
    //       path: 'https://cdn.jsdelivr.net/npm/@ant-design/plots@1.2.5/dist/plots.min.js',
    //     },
    //     {
    //       name: 'zod',
    //       var: 'Zod',
    //       path: 'https://unpkg.com/zod@3.21.4/lib/index.umd.js',
    //     },
    //     {
    //       name: 'react-hook-form',
    //       var: 'ReactHookForm',
    //       path: 'https://cdn.jsdelivr.net/npm/react-hook-form@7.43.8/dist/index.umd.min.js',
    //     },
    //     // {
    //     //   name: '@faker-js/faker',
    //     //   var: 'fakerJsfaker',
    //     //   path: 'https://cdn.jsdelivr.net/npm/@faker-js/faker@7.6.0/dist/cjs/index.js',
    //     //   // path: 'https://cdn.jsdelivr.net/npm/@faker-js/faker@7.6.0/dist/cjs/faker.js',
    //     // },
    //   ],
    // }),

    react(),
    pluginDnsPrefetch(),
    pluginVisualizer({
      open: true,
    }),
    pluginViteRestart({
      restart: ['vite.config.[jt]s'],
    }),
    // https://github.com/vitejs/vite/tree/main/packages/plugin-legacy
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  resolve: {
    alias: {
      '@types': path.resolve(rootDir, 'src/types'),
      '@utils': path.resolve(rootDir, 'src/utils'),
      '@redux': path.resolve(rootDir, 'src/redux'),
      '@hooks': path.resolve(rootDir, 'src/hooks'),
      '@services': path.resolve(rootDir, 'src/services'),
      '@components': path.resolve(rootDir, 'src/components'),
      '@pages': path.resolve(rootDir, 'src/pages'),
      '@routers': path.resolve(rootDir, 'src/routers'),
      '@assets': path.resolve(rootDir, 'src/assets'),
    },
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/hardwareMonitor': {
        target: 'ws://localhost:3001',
        // changeOrigin: true,
        // secure: false,
        ws: true,
      },
    },
  },
});
