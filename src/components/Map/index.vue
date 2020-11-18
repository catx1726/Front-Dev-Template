<template>
  <map
    class="map_container"
    :ref="refName"
    :longitude="mapSettings.longitude"
    :latitude="mapSettings.latitude"
    :markers="mapSettings.marker"
    :circles="mapSettings.circles"
    :scale="mapSettings.scale"
  ></map>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapDisableClickLocate, mapGetUserLocation, mapGetUserAuthorizeInfo } from '@/utils/map_utils'
export default Vue.extend({
  mixins: [],
  props: {
    refName: {
      type: String,
      default: 'map-default'
    },
    mapSettings: {
      type: Object,
      default: {
        latitude: 30.450817,
        longitude: 114.398313
      }
    }
  },
  data() {
    return {
      mapBaseInstance: '',
      userInfo: ''
    }
  },

  created() {
    // console.log('map component created hook!')
  },
  mounted() {
    let tempMap = this.$refs[this.refName]
    mapDisableClickLocate(tempMap)
    // console.log('map component mounted hook!', this.refName)
  },
  // onReady() {
  //   console.log('map component onReady hook!')
  // },
  // onHide() {
  //   console.log('map component onHide hook!')
  // },
  methods: {}
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
