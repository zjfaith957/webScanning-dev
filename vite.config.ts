import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { loadEnv } from 'vite'

export default ({ command, mode }) => {
	// ↓加载环境变量
  const env = loadEnv(mode, process.cwd());

  return {
    base: "./",
  	// ↓插件配置
    plugins: [vue()],
    // ↓解析配置
    resolve: {
      // ↓路径别名
      alias: {
        // ↓举例：@/abc => src/abc
        '@': resolve(__dirname, "src")
      }
    },
    // ↓服务端配置
    server: {
      // proxy:{
      //   //这里是通过请求/api 来转发到 https://api.pingping6.com/
      //   //假如你要请求https://api.*.com/a/a
      //   //那么axios的url，可以配置为 /api/a/a
      //   // '/api': 'http://dev.local.yjzhixue.com/' // 开发环境
      //   // '/api': 'http://192.168.0.174:8092/'  // 文杰本地
      //   '/api': 'http://192.168.0.171:9093/'  // 吴胄葳本地
      // },
      // 反向代理配置
      proxy: { 
        '/api': {
          target: 'http://dev.local.yjzhixue.com/', // 开发环境
          // target: 'http://192.168.0.171:9093/',
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
      // ↓读取环境变量中的HOST、PORT
      host: env['VITE_HOST'],
      port: env['VITE_PORT'],
      strictPort: true,
      // 是否自动浏览器打开
      open: true,
    }
  }
}
