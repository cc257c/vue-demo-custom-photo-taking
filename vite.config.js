import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';
// 使用postcss-pxtorem
import pxToRem from 'postcss-pxtorem'
// 引入postcss-pxtorem配置文件
import postcssConfig from './postcss.config'
import mkcert from "vite-plugin-mkcert";
export default defineConfig({
  plugins: [vue(), mkcert()],
  resolve: {
    //设置路径别名
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: {
      plugins: [
        // px换算成rem
        pxToRem(postcssConfig.plugins['postcss-pxtorem']),
      ]
    }
  },
})
