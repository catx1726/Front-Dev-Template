<template>
  <div v-if="show" class="message_container m-flex flex-jc-center flex-an-center">
    <v-snackbar v-model="show">
      {{ message }}
      <v-btn color="primary" @click.native="show = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'MessageComponent',
  props: {
    mshow: { type: Boolean, default: false },
    mmessage: { type: String, default: '' }
  },
  data() {
    return {}
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  created() {},

  methods: {
    handleClose() {
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
<style lang="scss">
.message_container {
  .v-snack__content {
    font-size: 1.5rem;
  }
}
</style>
