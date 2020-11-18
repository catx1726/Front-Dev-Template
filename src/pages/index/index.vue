<template>
  <scroll-view class="content">
    <view>
      <Map :ref-name="mapRefTag" :map-settings="mapSettings" class="map_container-index" />
    </view>
    <view class="btns_container m-flex flex-jc-center">
      <button :disabled="signBtn.state" class="btn-sign" @click="userSign">{{ signBtn.msg }}</button>
      <button class="btn-sign" @click="cleanSignInfo">{{ resetBtn.msg }}</button>
      <button class="btn-sign" open-type="storeUserAuthLocationInfo" @click="userRelocation">
        {{ reLocationBtn.msg }}
      </button>
    </view>
  </scroll-view>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '@/store/index'
import { sign } from '@/utils/sign'
import { MapRenderMarkerType } from '@/model/map-settings/index'
import { mapRenderLocationIcon } from '@/utils/map_utils'
import Map from '@/components/Map/index.vue'
export default Vue.extend({
  mixins: [],
  components: {
    Map
  },
  data() {
    return {
      mapRefTag: 'map-index', // map+使用位置
      /*
        tips:
        1. circle 和 marker[0] 经纬度对应
        2. 用户切换项目(切换打卡地点)，就是修改 marker[0] 和 circle
        3. 用户的 marker 放在 marker[1] 中
      */
      mapSettings: {
        scale: 12,
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
      reLocationBtn: { msg: '重新定位', state: false },
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

      if (!this.mapSettings.marker[1]) return
      this.mapSettings.marker.splice(1, 1)
      console.log('index method cleanSignInfo:', this.mapSettings.marker)
    },

    /* 用户点击更新定位 */
    async userRelocation() {
      // 已经打卡
      if (!(await this.storeUserSignInfo())) return

      // 权限检测
      await this.storeUserAuth()

      console.log('index method userRelocation!')
      let { lat, lnt, authState } = store.state.user.locationInfo
      this.mapSettings.marker.splice(1, 1)
      this.mapSettings = mapRenderLocationIcon(MapRenderMarkerType.USER, this.mapSettings, { lat, lnt })
    },

    /*
      用户点击打卡
      *.
        获取权限 ——> 获得地址，在下面逻辑中没有执行获取权限，
        是因为在 onShow 阶段已经拉取过，这里需要一个失败后重新拉取的按钮
      1. 保存到 vuex
      2. 保存到本地
    */
    async userSignInfoSave() {
      let signInfo = { time: this.dayjs().format('YYYY-MM-DD'), signed: true }
      store.dispatch('user/sign', signInfo)
      sign.set(signInfo)
    },
    async userSign() {
      // TODO 对接

      // 检测是否有权限
      await this.storeUserAuth()

      let { lat, lnt, authState } = store.state.user.locationInfo
      console.log('index method userSign before:', store.state.user.locationInfo)

      // 打卡信息保存
      await this.userSignInfoSave()

      // 地图绘制
      this.mapSettings.scale = 6
      this.mapSettings = mapRenderLocationIcon(MapRenderMarkerType.USER, this.mapSettings, { lat, lnt })

      this.signBtn.state = true
      this.signBtn.msg = '已打卡'

      console.log('index method userSign done:', this.mapSettings.marker)
    },

    /*
    检查打卡状态:
    1. 如果没打卡，那么每一次进入页面就拉一次地址
    2.
      如果已经打卡，就不用调取地址，但是每次需要检测时间，
      如果已经超过 24小时，则清空状态，重新打卡
    */
    async storeUserSignInfo() {
      let { time, signed } = sign.get() || store.state.user.signInfo
      // 已经打卡
      if (!!signed) {
        await this.storeUserSignedCheck(time)
        return false
      }
      // 没打过卡
      await this.storeUserAuthLocationInfo()
      return true
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
      this.storeUserAuthLocationInfo()
      return true
    },

    /* 权限调起，手动触发 */
    async storeUserAuth() {
      return await store.dispatch('user/getUserAuth')
    },
    /* 权限调起，自动触发，然后再 store 中获取位置并返回 */
    async storeUserAuthLocationInfo() {
      try {
        let res = await store.dispatch('user/getLocation')
        console.log('index method storeUserAuthLocationInfo:', res, store.state.user.locationInfo)
      } catch (error) {
        console.error('index method storeUserAuthLocationInfo error:', error)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
