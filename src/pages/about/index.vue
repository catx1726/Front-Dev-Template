<template>
  <view class="about_container ">
    <view class="bg-template"></view>

    <LoginForm v-if="!userLoginState"></LoginForm>

    <view v-if="userLoginState" class="about_box m-flex flex-jc-center flex-an-center">
      Hello😄:{{ userInfo.name }}
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
      userInfo: { name: '' }
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
