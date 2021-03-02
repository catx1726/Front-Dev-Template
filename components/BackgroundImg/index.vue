<template>
  <div>
    <div
      class="bg-template m-flex flex-jc-center flex-an-center"
      :style="{ 'background-image': 'url(' + bgImgUrl + ')' }"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'BackgroundImgComponent',
  components: {},
  props: {
    bgImgUrl: {
      type: String,
      default: 'https://img.imgdb.cn/item/6034a5785f4313ce25312c94.png'
    }
  },
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
