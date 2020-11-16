// router/index.js
import modules from './modules'
import Vue from 'vue'
import Router from 'uni-simple-router'

Vue.use(Router)
//初始化
const router = new Router({
  routes: [...modules] //路由表
})

console.log('router index.ts router:', router)

//全局路由前置守卫
router.beforeEach((to: any, from: any, next: any) => {
  console.log('router beforeEach!')
  next()
})
// 全局路由后置守卫
router.afterEach((to: any, from: any) => {})
export default router
