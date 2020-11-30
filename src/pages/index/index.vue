<template>
  <scroll-view class="content">
    <view>
      <!-- sign-type-start -->
      <IndexSignSwitchButtonComponent
        :switch-btn="switchBtn"
        :switch-btn-style="switchBtnStyle"
        @user-switch-btn="userSwitchBtn"
      ></IndexSignSwitchButtonComponent>
      <!-- sign-type-end -->

      <!-- proj-select-start -->
      <IndexProjPickerComponent
        v-if="switchBtn.curBtn === switchBtn.btnType.NORMAL"
        :switch-btn="switchBtn"
        :cur-proj="mapCenterMarker"
        :proj-list="projList"
        @user-picker-proj-change="userPickerProjChange"
      ></IndexProjPickerComponent>
      <!-- proj-select-end -->

      <!-- map-component-start -->
      <Map :ref-name="mapRefTag" :map-settings="mapSettings" class="map_container-index" />
      <!-- map-component-end -->
    </view>

    <!-- sign-submit-container-start -->
    <IndexSignButtonComponent
      :sign-btn.sync="signBtn"
      :map-settings.sync="mapSettings"
      :map-span="mapSpan"
      :switch-btn="switchBtn"
      @user-sign="userSign"
      @user-relocation="userRelocation"
      @store-user-sign-info="storeUserSignInfo"
      @clean-sign-info="cleanSignInfo"
    ></IndexSignButtonComponent>
    <!-- sign-submit-container-end -->
  </scroll-view>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '@/store/index'
import { sign } from '@/utils/sign'
import { MapBtnSwitchType } from '@/model/map-settings/index'

import IndexSignButtonComponent from './components/sign-button/index.vue'
import IndexProjPickerComponent from './components/picker/index.vue'
import IndexSignSwitchButtonComponent from './components/sign-type-switch-button/index.vue'
import Map from '@/components/Map/index.vue'

export default Vue.extend({
  mixins: [],
  components: {
    Map,
    IndexSignButtonComponent,
    IndexProjPickerComponent,
    IndexSignSwitchButtonComponent
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
        latitude: 30.441786,
        longitude: 114.401199,
        marker: [
          {
            rotate: 0,
            width: 20,
            height: 20,
            id: 'proj-local',
            latitude: 30.441786, // 纬度
            longitude: 114.401199, // 经度
            iconPath: '../../static/icon/map/company.png',
            label: { content: 'ProjOne', fontSize: '18', textAlign: 'start' }
          }
        ],
        circles: [{ latitude: 30.441786, longitude: 114.401199, radius: '500', fillColor: '#42b98375' }]
      },
      mapCenterMarker: {
        rotate: 0,
        width: 20,
        height: 20,
        id: 'proj-local',
        latitude: 30.441786,
        longitude: 114.401199,
        iconPath: '../../static/icon/map/company.png',
        label: { content: 'ProjOne', fontSize: '18', textAlign: 'start' }
      }, // 存储当前打卡的项目地址
      mapSpan: 1000, // 允许打卡的范围，1公里 = 1000米
      signBtn: { msg: '打卡', state: false },
      reLocationBtn: { msg: '重新定位', state: false },
      resetBtn: { msg: '清空打卡数据', state: false },
      switchBtnStyle: { unselected: '#999999', selected: '#000000' },
      switchBtn: { curBtn: MapBtnSwitchType.NORMAL, btnType: MapBtnSwitchType },
      projList: [
        { name: 'ProjOne', latitude: 30.441786, longitude: 114.401199 },
        { name: 'ProjTwo', latitude: 32.441786, longitude: 115.401199 }
      ],
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

    /* 根据打卡类型，处理 marker 和 circle 和 mapCenter */
    handleMarkerInfo(type: MapBtnSwitchType) {
      /* TODO 如果用户没有项目，那么定位到公司地址，在获取 ProjList 的时候判断 */
      if (type === MapBtnSwitchType.TRAVAL) {
        this.mapSettings.marker.splice(0, 1)
        this.mapSettings.circles[0].radius = '0'
        return
      }

      // 地图视中心
      this.mapSettings.latitude = this.mapCenterMarker.latitude
      this.mapSettings.longitude = this.mapCenterMarker.longitude

      // map marker
      this.mapSettings.marker[0] = this.mapCenterMarker

      // map circle
      this.mapSettings.circles[0].radius = '500'
      this.mapSettings.circles[0].latitude = this.mapCenterMarker.latitude
      this.mapSettings.circles[0].longitude = this.mapCenterMarker.longitude
    },

    /* 为什么没有移动到组件里，是因为这里修改了数据(子组件修改父组件的数据)，不大合适 */
    userPickerProjChange(val: any) {
      let curIndex = val.detail.value
      let { name, latitude, longitude } = this.projList[curIndex]
      this.mapCenterMarker.label.content = name
      this.mapCenterMarker.latitude = latitude
      this.mapCenterMarker.longitude = longitude
      this.handleMarkerInfo(MapBtnSwitchType.NORMAL)
      console.log('index method userPickerProjChange!', name, latitude, longitude)
    },
    /* 为什么没有移动到组件里，是因为这里修改了数据(子组件修改父组件的数据)，不大合适 */
    userSwitchBtn(val: MapBtnSwitchType) {
      if (this.switchBtn.curBtn === val) return

      // TODO 处理 marker
      this.handleMarkerInfo(val)
      this.switchBtn.curBtn = val
      console.log('index method userSwitchBtn!', val, this.switchBtn.curBtn === this.switchBtn.btnType.NORMAL)
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
