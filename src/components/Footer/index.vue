<template>
  <footer class="footer_container">Footer Component!</footer>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
  props: {
    msg: String
  }
})
export default class MyFooter extends Vue {
  msg!: string
}
</script>
<style lang="scss" scoped>
.footer_container {
  bottom: 2.5vh;
  font-size: 2rem;
  position: fixed;
}
</style>
