import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  mode: 'development',
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  server: {
    host:
        'localhost',
    // 'localhost',
    port: 80,
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      },
      // '/res': {
      //   target: 'https://fcfz-oa.oss-cn-shanghai.aliyuncs.com/',
      //   changeOrigin: true,
      //   rewrite: path => path.replace(/^\/api/, '').replace(/^\/res/, '')
        // }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src') // 配置 '@' 指向 'src' 目录
    }
  },
})
