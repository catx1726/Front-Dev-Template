<template>
  <view>
    <form @submit="formSubmit" class="form_container m-flex flex-an-center flex-jc-center">
      <view class="m-flex flex-dir-col">
        <view class="m-flex minput" v-for="(inputItem, idx) of inputListInfo" v-key="`${inputItem.model}-${idx}`">
          <view class="title">{{ inputItem.title }}</view>
          <input
            class="uni-input"
            name="input"
            :type="inputItem.type"
            v-model="userInfo[inputItem.model]"
            :placeholder="inputItem.placeholder"
          />
        </view>
      </view>

      <view class="formbtn_container">
        <button v-if="auth.state" form-type="submit" class="submit-btn">提交</button>
        <button v-else open-type="getUserInfo" class="submit-btn noauth" @getuserinfo="onUserGaveAuth">
          获取授权
        </button>
        <button class="submit-btn" @click="red('/pages/pg-user-info-form/index')">来宾登录</button>
      </view>
    </form>
    <view class="info_container">
      <span class="mini-into">注意: 该小程序，仅供华胜公司内部人员使用</span>
    </view>
  </view>
</template>

<script lang="ts">
const CONSOLE_TAG = 'page login-form'

import Vue from 'vue'
import store from '@/store/index'
import cpop from '@/utils/uni_pop'
import { userPrivateInfoByApp, userPublicInfo } from '@/utils/permission'
import { request } from '@/utils/request'
import { getUniID_API, getAPPID_API, postInviteCode_API, getUserRegistered_API, postRegister_API } from '@/api/user'
import { userAuthNeedLogin } from '@/utils/permission'
import { PageRuleEnum } from '@/model/page-rule'
export default Vue.extend({
  name: '',
  components: {},
  props: [],
  data() {
    return {
      auth: {
        state: <Boolean>false,
        privateInfo: <UniApp.LoginRes | any>{},
        publicInfo: <UniApp.UserInfo | any>{},
        unionId: <string>'',
        openId: <string>'',
        id: <string>'',
        phone: <string>'',
        inviteCode: <string>''
      },
      userInfo: { password: '', id: '' },
      pageRule: PageRuleEnum.InnerUser,
      inputListInfo: [
        { title: '用户名', placeholder: '请输入用户名', type: 'input', model: 'id' },
        { title: '密码', placeholder: '请输入密码', type: 'password', model: 'password' }
      ]
    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  created() {
    this.getUserInfoAuth()
  },
  onLoad() {},

  methods: {
    /* 页面刚打开不能直接拉出弹框授权，否则审核不通过 */
    async getUserInfoAuth() {
      let check = await store.dispatch('user/getInfoAuth')
      // 未授权，提醒用户给予授权
      if (!check) {
        cpop.popToast({ title: '请给予授权', icon: 'none' })
        return
      }
      // 已授权，拿到信息检测用户是否注册，注册直接跳转，没注册就进入注册逻辑
      return await this.handleAuthorizedInfo()
    },

    /* 已授权的一些列数据处理 */
    async handleAuthorizedInfo() {
      try {
        let publicAuth = await userPublicInfo()
        let privateAuth = await userPrivateInfoByApp()
        let loginInfo = await request.get(getUniID_API, { js_code: privateAuth.code })
        // 处理返回值
        this.handleLoginResDate(loginInfo, privateAuth, publicAuth)

        // TODO 检查是否有登录凭据,处理下面的 openId 之后才能自动登录...见 row 116 的 TODO
        // 检验是否注册
        this.handleCheckUserRegistered(this.auth.openId)
        return true
      } catch (error) {
        return false
        console.log('handleAuthorizedInfo error:', error)
      }
    },
    /*
      检查用户是否已经注册过，未注册就代表没授权，也就没有 unionId
      如果已经注册过，那么在跳转到该页面时，就直接跳转到下一个页面(指定界面，目前是 卡包界面)
    */
    async handleCheckUserRegistered(uionId: string) {
      // unionId 存在，说明授权了，且拿到了 unionId
      let res = await request.get(getUserRegistered_API, { vxid: uionId })
      // id 为空，说明没注册，走正常的注册逻辑
      if (!res.Info.Id) {
        return
      }
      // 有注册，直接登录，保存数据库生成的ID
      this.auth.id = res.Info.Id
      this.userInfo.id = res.Info.Name
      let userAllInfo = this.handleUserAllInfo()
      // 存储到本地且跳转页面
      await store.dispatch('user/login', userAllInfo)
      this.red('/pages/index/index')
      console.log(`${CONSOLE_TAG}`, 'handleCheckUserRegistered:', res, userAllInfo)
      return
    },
    /* 用户给予授权 */
    async onUserGaveAuth(e: any) {
      // DES 注意！暂时使用 openId，而非 unionId；
      // TODO 无授权，当用户没有绑定公众号等平台，则需要通过密钥去解析出 unionId
      let { iv, encryptedData, signature } = e.detail

      await this.handleAuthorizedInfo()

      console.log(CONSOLE_TAG, 'onUserGaveAuth:', e, iv, encryptedData, signature, this.auth)
    },

    /* 拿到 privateAuth 和 publicAuth 之后进行处理，全放到 this.auth 中，副作用函数 🤡 */
    handleLoginResDate(loginInfo: any, privateAuth: any, publicAuth: any) {
      this.auth.state = true
      // TODO 这里因为没有 openid 可能会导致用户看不到卡包的内容，因为抽奖注册输入的是用户名而非 hs30XX
      this.auth.unionId = loginInfo.unionid
      this.auth.openId = loginInfo.openid
      this.auth.privateInfo = privateAuth
      this.auth.publicInfo = publicAuth
    },
    validator() {
      console.log('validator:', this.userInfo)
      if (!this.auth.state) {
        cpop.popToast({ title: '未授权!', icon: 'none' })
        return false
      }
      if (!this.userInfo.id.length || !this.userInfo.password) {
        cpop.popToast({ title: '不得为空!', icon: 'none' })
        return false
      }
      return true
    },
    /* 处理用户数据 */
    handleUserAllInfo() {
      /* 
        FIXME 
        这里我是简单的通过该用户进入的页面来判断权限，这样是不行的 
        必须后端返回一个权限级别，然后再来判断  
      */

      let id = this.userInfo.id
      let { unionId, openId, phone } = this.auth
      let { nickName, avatarUrl } = this.auth.publicInfo
      let userAllInfo = {
        id,
        phone,
        openId,
        uniId: unionId,
        avatar: avatarUrl,
        userName: nickName,
        rule: this.pageRule
      }
      console.log('component LoginForm handleUserAllInfo:', id, userAllInfo)
      return userAllInfo
    },
    /* 
      注册，这里为什么不是登录，是因为我们后续登录不需要账户和密码，只要微信提供的唯一值即可 
      登录，放在了 handleCheckUserRegistered 检查是否注册的逻辑里
    */
    async formSubmit(e: Event) {
      try {
        if (!this.validator()) return

        let userAllInfo = this.handleUserAllInfo()
        // TODO 登录成功就保存用户输入的信息，如 id hs30XX，并且拿到返回的信息，如真实姓名

        // OK 在 store 的 action 中 将信息保存到本地，暂无 TOKEN
        await store.dispatch('user/login', userAllInfo)

        this.red('/pages/index/index')

        cpop.popToast({ title: '成功!', icon: 'success' })
        console.log('component LoginForm methods formSubmit:', userAllInfo, this.auth)
      } catch (error) {
        cpop.popToast({ title: '失败!', icon: 'none' })
        console.log(CONSOLE_TAG, 'handleFormSubmit error:', error)
      }
    }
  }
})
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
