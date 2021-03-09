<template>
  <view class="m-flex flex-jc-center flex-an-center">
    <BackgroundImg class="bg" />
    <view class="content-container">
      index-page
      <button class="btn mini" @tap="nav(testBtn.nav)">
        {{ testBtn.name }}
      </button>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '@/store'
import cpop from '@/utils/uni_pop'

import BackgroundImg from '@/components/BackgroundImg/index.vue'

export default Vue.extend({
  name: 'IndexPage',
  components: { BackgroundImg },
  props: [],
  data() {
    return {
      testBtn: { nav: '/pages/sub-packages-one-pages/login-page/index', name: '测试权限' },
      bgImage: 'https://img.imgdb.cn/item/6034a5785f4313ce25312c94.png'
    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  created() {},

  onShow() {},

  onReachBottom() {},

  methods: {}
})
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
<style lang="scss">
.sign-list_container .uni-list {
  background-color: transparent;
}
</style>
