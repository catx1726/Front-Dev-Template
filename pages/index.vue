<template>
  <main class="index-container">
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
  head() {
    return {
      title: this.title
    }
  }
}
</script>

<style lang="scss" scoped>
.index-container {
  background-size: contain;
  background-position: center;
  background-image: url('/imgs/TV-80 玲.png');
}
</style>
