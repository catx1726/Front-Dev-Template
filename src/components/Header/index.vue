<template>
  <header class="header_container">
    <span>Header Component:</span>
    <router-link to="/home">Home</router-link>
    |
    <router-link to="/about">About</router-link>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'MyHeader',
  setup() {
    return {}
  }
})
</script>
<style lang="scss" scoped>
.header_container {
  top: 2vh;
  font-size: 2rem;
  position: absolute;
}
</style>
