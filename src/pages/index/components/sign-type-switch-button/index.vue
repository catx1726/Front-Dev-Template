<template>
  <view class="btns_container-switch m-flex">
    <button
      class="mbtn btn-switch"
      @click="$emit('userSwitchBtn', switchBtn.btnType.NORMAL)"
      :style="{
        color: switchBtn.curBtn === switchBtn.btnType.NORMAL ? switchBtnStyle.selected : switchBtnStyle.unselected
      }"
    >
      打卡
    </button>

    <span class="btn-switch-line">|</span>

    <button
      class="mbtn btn-switch"
      @click="$emit('userSwitchBtn', switchBtn.btnType.TRAVAL)"
      :style="{
        color: switchBtn.curBtn === switchBtn.btnType.TRAVAL ? switchBtnStyle.selected : switchBtnStyle.unselected
      }"
    >
      出差
    </button>
  </view>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IndexSignTypeSwitchBtnComponent',
  components: {},
  props: {
    switchBtn: {
      type: Object,
      default: {}
    },
    switchBtnStyle: {
      type: Object,
      default: {}
    },
    userSwitchBtn: {
      type: Function
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
    console.log('index component IndexSignTypeSwitchBtnComponent!', this.userSwitchBtn)
  },

  methods: {}
})
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
