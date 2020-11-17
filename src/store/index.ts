import Vue from 'vue'
import Vuex from 'vuex'

import user from './user'

Vue.use(Vuex)

const store: any = new Vuex.Store({
  modules: {
    user
  }
})

export default store
