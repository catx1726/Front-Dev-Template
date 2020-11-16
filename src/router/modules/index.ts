// router/modules/index.js
const files = require.context('.', false, /\.ts$/)
const modules: AnyArray = []

files.keys().forEach((key) => {
  if (key === './index.ts') return
  const item = files(key).default
  modules.push(...item)
  console.log('item:', item)
})

export default modules
