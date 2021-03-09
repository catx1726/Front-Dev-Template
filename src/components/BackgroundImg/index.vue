<template>
  <view class="bg-template" :style="{ 'background-image': 'url(' + bgImgUrl + ')' }"></view>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
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

  created() {
    console.log('index created!', this.bgImgUrl)
  },
  onLoad() {},
  onShow() {},
  methods: {}
})
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
