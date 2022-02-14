import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import NormalLayout from '@/layout/normal_layout/template.vue'

const publicRoutes: Array<RouteRecordRaw> = [
  { path: '/', redirect: { name: 'HomeIndex' } },
  {
    path: '/home',
    name: 'Home',
    redirect: '/home',
    component: NormalLayout,
    children: [
      {
        path: '/home',
        name: 'HomeIndex',
        component: () => import('@/views/home/template.vue'),
        meta: { title: '首页' }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/error_page/404.vue'),
    meta: { icon: 'side', title: '错误页', index: 100, hidden: true }
  },
  // 404 page must be placed at the end !!!
  { path: '/:catchAll(.*)', redirect: '/404', meta: { index: 100, hidden: true } }
]

export const whiteList: { [key: string]: Array<string | undefined> } = {
  // 请求头需要改变类型的接口
  needQSAPIList: ['/user/login'],
  // 需要走业务逻辑校验的接口
  needBSAPIList: [import.meta.env.VITE_BASE_ROOT],
  notEnterWatcher: ['/login', '/404', '/browserCheck']
}

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...publicRoutes]
})

export default router
