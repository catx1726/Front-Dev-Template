import dayjs from 'dayjs'
declare module '*.vue' {
  import Vue from 'vue'
  interface
  export default Vue
}

declare module 'vue/types/vue' {
  interface Vue {
    dayjs: dayjs
  }
}
