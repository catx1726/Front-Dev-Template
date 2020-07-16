<template>
  <main class="login_container">
    You need login man!
    <v-form class="pa-4" @submit.prevent="login">
      <v-text-field v-model="loginModel.username" label="用户名"></v-text-field>

      <v-text-field
        v-model="loginModel.password"
        label="密码"
        type="password"
        autocomplete="new-password"
      ></v-text-field>

      <v-btn color="success" type="submit">登录</v-btn>
    </v-form>
  </main>
</template>

<script>
export default {
  name: '',

  components: {},
  props: [],
  data() {
    return {
      loginModel: {}
    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  created() {},

  methods: {
    async login() {
      await this.$auth.loginWith('local', {
        data: this.loginModel
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.login_container {
  color: black;
  text-transform: uppercase;
}
</style>
