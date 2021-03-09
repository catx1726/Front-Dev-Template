<template>
  <view class="m-flex flex-jc-center flex-an-center">
    <BackgroundImg class="bg-img" />
    login-page
  </view>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '@/store'
import cpop from '@/utils/uni_pop'

import BackgroundImg from '@/components/BackgroundImg/index.vue'

export default Vue.extend({
  name: 'SubPackLoginPage',
  components: {},
  props: [],
  data() {
    return {}
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
