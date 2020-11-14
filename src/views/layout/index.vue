<template>
  <MyHeader></MyHeader>
  <main class="main_container m-flex flex-jc-center flex-an-center">
    <router-view></router-view>
  </main>
  <MyFooter></MyFooter>
</template>

<script lang="ts">
import MyHeader from '@/components/Header/index.vue'
import MyFooter from '@/components/Footer/index.vue'
export default {
  name: 'Layout',
  components: {
    MyHeader,
    MyFooter
  },
  setup() {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.main_container {
  margin: 5vh 0;
  min-height: 90vh;
  position: relative;
}
</style>
