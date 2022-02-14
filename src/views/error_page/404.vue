<template>
  <main class="error_page 404 m-flex flex-jc-center flex-an-center">
    <iframe src="https://embed.lottiefiles.com/animation/66321" style="background-color: black" />
    <!-- <span v-if="!animtaionLoaded" class="text">oops~ LOS,error:404</span> -->
    <!-- <button class="hs-btn success hs-ripple goto-index" @click="handleGoBack">带我回去</button> -->
    <!-- <svg-icon-comp style="width:100vw;height:50vh" icon-class="404" /> -->
  </main>
</template>

<script lang="ts">
export default {
  name: 'ErrorPage404',

  components: {},
  props: []
}
</script>
<style lang="scss">
.error_page {
  height: 100vh;
}
.error_page .text {
  font-size: 5rem;
  position: absolute;
  color: white;
}
.goto-index {
  right: 10px;
  bottom: 10px;
  position: absolute;
}
</style>
