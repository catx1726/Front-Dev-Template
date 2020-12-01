<template>
  <view>
    <form @submit="formSubmit" class="form_container m-flex flex-an-center flex-jc-center">
      <view class="m-flex flex-dir-col">
        <view class="m-flex minput">
          <view class="title">用户名:</view>
          <input class="uni-input" name="input" v-model="userInfo.username" placeholder="请输入用户名" />
        </view>
        <view class="m-flex minput">
          <view class="title">密码:</view>
          <input class="uni-input" type="password" v-model="userInfo.password" name="input" placeholder="请输入密码" />
        </view>
      </view>
      <view class="formbtn_container">
        <button form-type="submit" class="submit-btn">登录</button>
      </view>
    </form>
  </view>
</template>

<script>
import Vue from 'vue'
import store from '@/store/index'
import { popToast } from '@/utils/uni_pop'
export default Vue.extend({
  name: '',
  components: {},
  props: [],
  data() {
    return {
      userInfo: { password: '', username: '' }
    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  created() {},

  methods: {
    validator() {
      if (!this.userInfo.username.length || !this.userInfo.password.length) {
        popToast({ title: '不得为空!', icon: 'none' })
        return false
      }
      return true
    },
    async formSubmit(e) {
      if (!this.validator()) return

      await store.dispatch('user/login', this.userInfo)

      uni.switchTab({
        url: '/pages/index/index'
      })

      popToast({ title: '登陆成功!', icon: 'success' })
      // console.log('component LoginForm methods formSubmit:', e)
    }
  }
})
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
