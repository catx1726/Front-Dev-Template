<template>
  <view class="about_container">
    <view class="bg-template"></view>

    <LoginForm v-if="!userLoginState"></LoginForm>

    <view v-if="userLoginState" class="about_box m-flex flex-dir-col flex-jc-center flex-an-center">
      <!-- user-info-start -->
      <view class="userinfo_container m-flex flex-an-end flex-jc-center">
        <div class="usericon_box">
          <img :src="userInfo.avatar" class="uavatar" alt="" />
        </div>
        <div class="username_box">Hello: {{ userInfo.name }}</div>
      </view>
      <!-- user-info-end -->

      <!-- user-sign-list-start -->
      <scroll-view class="sign-list_container">
        <ul class="list_box">
          <li v-for="(item, index) in signList" :key="'signItem-' + index" class="list_item">
            <span class="info">状态: {{ item.state }}</span>
            <span class="info">时间: {{ item.time }}</span>
            <span class="info">地点: {{ item.location }}</span>
          </li>
        </ul>
      </scroll-view>
      <!-- user-sign-list-end -->

      <!-- user-logout-start -->
      <view class="logout_container">
        <button class="logout-btn" @click="userLogout">
          退出
        </button>
      </view>
      <!-- user-logout-start -->
    </view>
  </view>
</template>

<script>
import Vue from 'vue'
import store from '@/store'
import cpop from '@/utils/uni_pop'
import LoginForm from './components/login-form/index.vue'
import { userAuthNeedLogin } from '@/utils/permission'

export default Vue.extend({
  name: '',
  components: { LoginForm },
  props: [],
  data() {
    return {
      userLoginState: false,
      userInfo: { name: '', avatar: '../../static/imgs/584_2020072015417303.jpg' },
      signList: [
        { time: '2020年11月30日', state: '已打卡', location: '阳光100大湖第' },
        { time: '2020年11月30日', state: '已打卡', location: '阳光100大湖第' }
      ]
    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  created() {
    console.log('about created!')
  },

  onShow() {
    this.userLogged()
  },
  methods: {
    userLogout() {
      store.dispatch('user/logout')
      this.userLoginState = false
      cpop.popToast({ title: '已退出!', icon: 'success' })
    },
    userLogged() {
      this.userLoginState = userAuthNeedLogin()
      this.userInfo.name = store.state.user.name
      console.log('about userLogged:', this.userLoginState)
    }
  }
})
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
