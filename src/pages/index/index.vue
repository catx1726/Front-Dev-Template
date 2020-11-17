<template>
  <scroll-view class="content">
    <view>
      <Map :ref-name="mapRefTag" :map-settings="mapSettings" class="map_container-index" />
    </view>
    <view class="btns_container m-flex flex-jc-center">
      <button :disabled="signBtn.state" class="btn-sign" @click="userSign">{{ signBtn.msg }}</button>
      <button class="btn-sign" @click="cleanSignInfo">{{ resetBtn.msg }}</button>
    </view>
  </scroll-view>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '@/store/index'
import Map from '@/components/Map/index.vue'
import { sign } from '@/utils/sign'
export default Vue.extend({
  mixins: [],
  components: {
    Map
  },
  data() {
    return {
      mapRefTag: 'map-index', // map+使用位置
      mapSettings: {
        latitude: 39.909, //经度39.909
        longitude: 116.39742, //纬度116.39742
        marker: [
          {
            rotate: 0,
            width: 20,
            height: 20,
            id: 'proj-local',
            latitude: 39.909, // 纬度
            longitude: 116.39742, // 经度
            iconPath: '../../static/icon/map/local.png',
            label: { content: '临时模拟的项目地址', fontSize: '18', textAlign: 'start' }
          }
        ],
        circles: [{ latitude: 39.909, longitude: 116.39742, radius: '100', fillColor: '#42b98375' }]
      },
      signBtn: { msg: '打卡', state: false },
      resetBtn: { msg: '清空打卡数据', state: false },
      title: 'Hello'
    }
  },
  created() {
    console.log('index created hook!')
  },
  onReady() {
    console.log('index onReady hook!')
  },
  onHide() {
    console.log('index onHide hook!')
  },
  // 对于打卡，在每次进入页面的时候，清空 store 并重新获取，实现进一次拉取一次地址，如果当天内已经签到就不需要拉取
  onShow() {
    this.storeUserSignInfo()
    console.log('index onShow hook!')
  },
  methods: {
    // TODO 方法命名也可以使用 BEM ??
    /* 清空数据( vuex/本地 ) */
    cleanSignInfo() {
      sign.clear()
      store.dispatch('user/cleanSignInfo')
      this.signBtn.state = false // 按钮开启
      this.signBtn.msg = '打卡'
    },

    /* 
      用户点击打卡
      1. 保存到 vuex 
      2. 保存到本地
    */
    async userSign() {
      // TODO 对接
      let signInfo = { time: this.dayjs().format('YYYY-MM-DD'), signed: true }
      store.dispatch('user/sign', signInfo)
      sign.set(signInfo)
      let { lat, lnt } = store.state.user.locationInfo
      this.mapSettings.marker[1] = {
        rotate: 0,
        width: 20,
        height: 20,
        id: 'proj-local',
        latitude: lat, // 纬度
        longitude: lnt, // 经度
        iconPath: '../../static/icon/map/person.png',
        label: { content: '真实的GPS地址', fontSize: '18', textAlign: 'start' }
      }

      this.signBtn.state = true
      this.signBtn.msg = '已打卡'
    },

    /* 检测是否需要重置打卡状态 */
    async storeUserSignedCheck(signTime: string) {
      let today = this.dayjs().format('YYYY-MM-DD')
      // 不需要重置
      if (today === signTime) {
        this.signBtn.msg = '已打卡'
        this.signBtn.state = true // 禁用按钮
        return false
      }

      // 需要重置( 本地 / vuex )
      this.cleanSignInfo()
      this.storeUserLocationInfo()
      return true
    },

    /*
    检查打卡状态:
    1. 如果没打卡，那么每一次进入页面就拉一次地址
    2. 如果已经打卡，就不用调取地址，但是每次需要检测时间，如果已经超过 24小时，则清空状态，重新打卡
    */
    async storeUserSignInfo() {
      let { time, signed } = store.state.user.signInfo || sign.get()
      // 已经打卡
      if (!!signed) {
        this.storeUserSignedCheck(time)
        return
      }
      // 没打过卡
      this.storeUserLocationInfo()
    },

    /* 权限调起，然后再 store 中获取位置并返回 */
    async storeUserLocationInfo() {
      try {
        let res = await store.dispatch('user/getLocation')
        console.log('index method storeUserLocationInfo:', res, store.state.user.locationInfo)
      } catch (error) {
        console.error('index method storeUserLocationInfo error:', error)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
