<template>
  <main class="secure_container">
    This SecurePage,so you need login!
  </main>
</template>

<script>
export default {
  name: 'SecurePage',

  middleware: ['auth'],

  components: {},
  props: [],
  data() {
    return {
      title: 'SecurePage',
      meta: [{ hid: 'description', name: 'description', content: 'Vue-Nuxt-Template!' }]
    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  created() {},

  methods: {},

  head() {
    return { title: this.title, meta: this.meta }
  }
}
</script>
<style lang="scss" scoped>
.secure_container {
  color: black;
  text-transform: uppercase;
}
</style>
