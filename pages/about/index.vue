<template>
  <div class="about-container">About</div>
</template>

<script>
export default {
  name: 'About',

  components: {},
  data() {
    return {
      title: 'About'
    }
  },
  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  created() {},

  methods: {},
  head() {
    return {
      title: this.title
    }
  }
}
</script>
<style lang="scss" scoped>
.about-container {
  background-size: contain;
  background-position: center;
  background-image: url('/imgs/TV-106 七宝.png');
}
</style>
