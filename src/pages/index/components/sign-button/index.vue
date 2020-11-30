<template>
  <view class="btns_container m-flex flex-jc-center flex-an-center">
    <button :disabled="signBtn.state" class="mbtn btn-sign" @click="userSign(switchBtn.curBtn)">
      {{ signBtn.msg }}
    </button>
    <button class="mbtn btn-sign-relocation" open-type="storeUserAuthLocationInfo" @click="userRelocation">
      <text class="iconfont icon-reload"></text>
      <!-- {{ reLocationBtn.msg }} -->
    </button>
    <button class="mbtn btn-sign-clean" @click="$emit('cleanSignInfo')">
      <text class="iconfont icon-clean"></text>
    </button>
  </view>
</template>

<script lang="ts">
import store from '@/store'
import cpop from '@/utils/uni_pop'
import { MapRenderMarkerType, MapBtnSwitchType, MarkerType } from '@/model/map-settings/index'
import { mapRenderLocationIcon, mapSpanUser } from '@/utils/map_utils'
import { userAuthNeedLogin } from '@/utils/permission'
import Vue from 'vue'
import { sign } from '@/utils/sign'
export default Vue.extend({
  name: 'IndexSignButtonComponent',
  mixins: [],
  props: {
    signBtn: {
      type: Object,
      default: {}
    },
    switchBtn: {
      type: Object,
      default: {}
    },
    mapSettings: {
      type: Object,
      default: {}
    },
    mapSpan: {
      type: Number
    },
    storeUserSignInfo: { type: Function },
    cleanSignInfo: { type: Function, default: () => {} }
  },
  data() {
    return {}
  },

  created() {},
  mounted() {},
  methods: {
    /* 权限调起，手动触发 */
    async storeUserAuth() {
      return await store.dispatch('user/getUserAuth')
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

    /* 用户点击更新定位 */
    async userRelocation() {
      // FIXME 已经打卡，就不让重新定位
      // TODO 已经打卡，后续完善(如 界面显示)
      if (this.signBtn.state) {
        cpop.popToast({ title: '您已打卡!', icon: 'none' })
        return
      }

      // 权限检测
      await this.storeUserAuth()

      console.log('index method userRelocation!')
      let { lat, lnt, authState } = store.state.user.locationInfo
      this.mapSettings.marker.splice(1, 1)
      let uLocation = mapRenderLocationIcon(MapRenderMarkerType.USER, this.mapSettings, { lat, lnt })
      this.$emit('update:mapSettings', uLocation)
      // this.mapSettings = uLocation
      cpop.popToast({ icon: 'success', title: '重定位成功!' })
    },
    async userSign(type: MapBtnSwitchType) {
      // TODO 对接

      // console.log('index component userSign:', type)

      if (!userAuthNeedLogin()) return

      // 检测是否有权限
      await this.storeUserAuth()

      // 存储 user 的位置信息
      let { lat, lnt, authState } = store.state.user.locationInfo

      // 判断 打卡类型 为普通打卡，需要计算距离等信息
      if (type === MapBtnSwitchType.NORMAL) {
        let { latitude, longitude } = this.mapSettings.marker[0]
        let span = mapSpanUser({ lat, lnt }, { lat: latitude, lnt: longitude })
        console.log('index method userSign before:', store.state.user.locationInfo)
        console.log('index method userSign mapSpanUser:', span)

        if (this.mapSpan <= span * 1000) {
          cpop.popToast({ title: '距离太远，无法打卡', icon: 'none' })
          return
        }
      }

      // 判断 打卡类型 为出差，不需要计算距离，只需要保存地址信息
      // 打卡信息保存
      await this.userSignInfoSave()

      // 地图绘制
      // this.mapSettings.scale = 12
      this.$emit('update:mapSettings', mapRenderLocationIcon(MapRenderMarkerType.USER, this.mapSettings, { lat, lnt }))

      // FIXME 拆分成组件之后，数据无法响应
      // this.signBtn.msg = '已打卡'
      // this.signBtn.state = true
      this.$emit('update:signBtn', { state: true, msg: '已打卡' })

      cpop.popToast({ title: '成功,祝愉快!', icon: 'success' })

      console.log('index method userSign done:', this.mapSettings.marker, this.signBtn)
    }
  }
})
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
