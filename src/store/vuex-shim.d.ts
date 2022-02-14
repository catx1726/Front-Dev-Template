import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  // 声明自己的 store state
  interface State {
    user:{token:string,name:string}
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}