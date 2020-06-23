<template>
  <main class="index_container">
    Index
  </main>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      title: 'Home'
    }
  },
  created() {
    console.log('test huksy')
  },
  methods() {},
  head() {
    return {
      title: this.title
    }
  }
}
</script>

<style lang="scss" scoped>
.index_container {
  background-size: contain;
  background-position: center;
  background-image: url('/imgs/TV-80 玲.png');
}
</style>
