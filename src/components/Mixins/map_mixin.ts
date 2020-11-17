import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      mixinTag: 'map_mixin'
    }
  },
  methods: {
    handleTest() {
      console.log(this.mixinTag)
    }
  }
})
