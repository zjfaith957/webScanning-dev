import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

// ↓定义路由
const routes: Array<RouteRecordRaw> = [
  // ↓layout父路由
  {
    // ↓路由地址
    path: '/',
    // ↓路由名称（唯一值），在路由跳转时能用到
    name: '',
    // ↓路由渲染组件
    component: () => import('@/views/layout/index.vue'),
    // ↓重定向
    redirect: { name: 'scan' },
    // ↓子路由
    children: [
      // ↓首页
      {
        path: '/scan',
        name: 'scan',
        component: () => import('@/views/scan/Scan.vue')
      }
    ]
  },
  // ↓异常
  {
    path: '/exception',
    name: 'exception',
    component: () => import('@/views/exception/Exception.vue')
  },
]

// ↓创建路由实例并传递routes
const router = createRouter({
  // ↓router内部提供了history模式的实现，使用hash模式
  history: createWebHashHistory(),
  routes,
})

export default router