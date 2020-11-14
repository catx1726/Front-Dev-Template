import router from '@/router/index'

router.beforeEach((to, from, next) => {
  next()
  console.log('router beforeEach! from:', from.path, '=> to:', to.path)
})
