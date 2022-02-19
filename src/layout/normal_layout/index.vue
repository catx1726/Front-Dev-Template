<template>
  <header class="header-container text-xl h-1/5">header</header>
  <main class="main-container h-4/5 bg-black text-gray">
    <router-view></router-view>
  </main>
  <footer class="footer-container h-1/5">footer</footer>
</template>

<script lang="ts">
export default {
  name: 'NormalLayoutPage',
  setup() {
    return {}
  },
  mounted() {},
  data() {
    return {}
  },
  watch: {},
  computed: {},
  methods: {}
}
</script>
<style lang="scss" scoped>
@import url(./index.scss);
</style>
