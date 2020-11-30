<template>
  <!-- proj-select-start -->
  <view class=" picker_container m-flex " v-if="switchBtn.curBtn === switchBtn.btnType.NORMAL">
    <text class="picker-title">当前项目：</text>
    <picker
      class="picker_box"
      @change="$emit('userPickerProjChange', $event)"
      :value="index"
      :range="projList"
      range-key="name"
    >
      <view class="picker-input">{{ curProj.label.content }}</view>
      <text class="iconfont icon-downarrow icon"></text>
    </picker>
  </view>
  <!-- proj-select-end -->
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IndexProjectPickerComponent',
  components: {},
  props: {
    switchBtn: {
      type: Object,
      default: {}
    },
    curProj: {
      type: Object,
      default: {}
    },
    projList: {
      type: Array,
      default: []
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
})
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
