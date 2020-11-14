<template>
  <div class="m-flex flex-dir-col">
    <button @click="objTemplate.name = 'change'">
      {{ objTemplate }}
    </button>
    <button @click="set(count + 1)">ClickNum:{{ count }}</button>
    <button @click="reset()">reset</button>
    <ul>
      <li>ref(val) 接受一个参数值并返回一个响应式且可改变的 ref 对象</li>
      <li>reactive(Obj) 接收一个普通对象然后返回该普通对象的响应式代理</li>
      <li>toRefs(Obj) 把一个对象的所有属性变成 Ref</li>
      <li>toRef(Obj,prototype) 创建一个 Ref 属性</li>
    </ul>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import { reactive } from 'vue'
import useCount from './hooks/useCounte'
import PersonInterface from '@/model/person/index'
export default {
  name: 'Cad',
  setup() {
    const { current: count, reset, set } = useCount(1, { min: 1, max: 15 })
    const objTemplate: PersonInterface = reactive({ name: '11', age: 18 })
    return { count, reset, set, objTemplate }
  }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
