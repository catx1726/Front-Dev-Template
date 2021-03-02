<template>
  <div class="loader_container m-flex flex-jc-center">
    <div v-show="loaderShow" class="loader m-flex flex-jc-center flex-an-center">
      <span class="outcubic"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoaderComponent',
  components: {},
  props: { loaderShow: { type: Boolean, default: false } },
  data() {
    return {}
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  created() {},

  methods: {}
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
