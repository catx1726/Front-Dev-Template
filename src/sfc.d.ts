import dayjs from 'dayjs'
import { nav, red, swi, back } from '@/components/Mixins/global_mixin.ts'
declare var TMap: any
declare var qq: any
declare var qqmapsdk: any

declare module '*.vue' {
  import Vue from 'vue'
  interface
  export default Vue
}

declare module 'vue/types/vue' {
  interface Vue {
    dayjs: dayjs
    nav
    red
    swi
    back
  }
}

// This will allow you to load `.json` files from disk

declare module '*.json' {
  const value: any
  export default value
}

// This will allow you to load JSON from remote URL responses

declare module 'json!*' {
  const value: any
  export default value
}
·