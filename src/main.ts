import Vue from 'vue'
import App from './App.vue'
import dayjs from 'dayjs'
// import './router/index'
// import { RouterMount } from 'uni-simple-router'

Vue.config.productionTip = false
Vue.prototype.dayjs = dayjs
new App().$mount()
