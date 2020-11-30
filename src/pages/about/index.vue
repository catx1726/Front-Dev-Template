<template>
  <view class="about_container">
    <view class="bg-template"></view>

    <LoginForm v-if="!userLoginState"></LoginForm>

    <view v-if="userLoginState" class="about_box m-flex flex-dir-col flex-jc-center flex-an-center">
      <!-- user-info-start -->
      <view class="userinfo_container m-flex flex-an-end flex-jc-between">
        <div class="usericon_box">
          <img :src="userInfo.avatar" class="uavatar" alt="" />
        </div>
        <div class="username_box">Hello: {{ userInfo.name }}</div>
      </view>
      <!-- user-info-end -->

      <!-- user-sign-list-start -->
      <scroll-view class="sign-list_container">
        <ul>
          <li v-for="(item, index) in signList" :key="'signItem-' + index">
            <span>时间:{{ item.time }}</span>
            <span>状态:{{ item.state }}</span>
            <span>地点:{{ item.location }}</span>
          </li>
        </ul>
      </scroll-view>
      <!-- user-sign-list-end -->
    </view>
  </view>
</template>

<script>
import LoginForm from '@/components/LoginForm/index'
import { userAuthNeedLogin } from '@/utils/permission'
import store from '@/store'

export default {
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
    userLogged() {
      this.userLoginState = userAuthNeedLogin()
      this.userInfo.name = store.state.user.name
      console.log('about userLogged:', this.userLoginState)
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
