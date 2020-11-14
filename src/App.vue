<template>
  <router-view />
</template>

<script lang="ts">
import Store from './store/index'
// import Layout from '@/views/layout/index.vue'

import { defineComponent, provide, ref } from 'vue'
export default defineComponent({
  components: {},
  setup() {
    provide(Store.userStore, ref([]))
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

a {
  font-weight: bold;
  color: #2c3e50;
}

a.router-link-exact-active {
  color: #42b983;
}
</style>
