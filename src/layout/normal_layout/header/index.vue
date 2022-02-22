<template>
  <div class="video-container h-4/5">
    <video v-show="pageData.loaded" src="../../../../public/video/video.mp4" autoplay></video>
    <img v-show="pageData.played || !pageData.loaded" src="../../../../public/img/layout_header_video_poster.png" />
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { handleVideoEntry, handleRemoveEventListener } from './type'

export default {
  name: 'LayoutHeader'
}
</script>
<script lang="ts" setup>
onMounted(() => {
  handleVideoEntry(pageVideoLoaded, pageVideoPlayed)
})

const pageData = ref({ played: false, loaded: false })

/* 视频加载完毕 */
function pageVideoLoaded() {
  console.log('pageVideoLoaded!')
  pageData.value.loaded = true
}

/* 视频播放完毕 */
function pageVideoPlayed() {
  console.log('pageVideoPlayed!')
  pageData.value.loaded = false
  pageData.value.played = true
  handleRemoveEventListener()
}
</script>

<style lang="scss" scoped>
.video-container {
  width: 100%;
  max-height: 70vh;
  overflow: hidden;
  img {
    width: 100%;
  }
}
</style>
