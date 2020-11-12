<template>
  <view class="content">
    <view>
      <text class="title">{{ title }}WTF!</text>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      title: 'Hello'
    }
  },
  methods: {}
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
