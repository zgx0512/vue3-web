import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
//mock插件提供方法
import { viteMockServe } from 'vite-plugin-mock'
export default defineConfig(({ command }) => {
  return {
    plugins: [vue(),
    createSvgIconsPlugin({
      // 指定要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    }),
    viteMockServe({
      // supportTs: false,
      // logger: false,
      // mockPath: "mock/user",
      localEnabled: command === 'serve',   // 保证在开发阶段可以使用mock接口
    })],
    resolve: {
      alias: {
        '@': path.resolve("./src")  // 相对路径别名配置，使用@代替src
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
    // 配置跨域
    server: {
      proxy: {
        '/api': {
          target: 'http://sph-api.atguigu.cn',   // 跨域请求的地址
          changeOrigin: true,    // 开启跨域
          rewrite: (path) => path.replace(/^\/api/, ''),   // 去除前缀
        }
      }
    }
  }
})
