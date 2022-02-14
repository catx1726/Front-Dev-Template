/* eslint-disable space-before-function-paren */
import router, { whiteList } from '@/router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getPageTitle } from '@/utils/document'
import { getToken } from '@/utils/cookies'
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const devTokenError = ['null', 'undefined']

router.beforeEach(async (to, from, next) => {
  const token = getToken()

  console.log('beforeEach!', to, from, router, token, import.meta.env.VITE_PG_TITLE, import.meta.env)

  // start progress bar
  NProgress.start()

  // 浏览器 tab title
  document.title = getPageTitle(to)?.toString() || ''

  next()
  /* 无 token */
  // if (!token || devTokenError.includes(token)) return await handleNoToken(to, from, next)

  /* 有 token */
  // return await handleHaveToken(to, from, next)
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
  console.log('afterEach!')
})

async function handleNoToken(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {}

async function handleHaveToken(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {}
