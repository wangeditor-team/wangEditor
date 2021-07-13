<script lang="ts">
import Vue from 'vue'
import Basic from './pages/Basic.vue'
import Simple from './pages/Simple.vue'

export default Vue.extend({
  //【注意】单独写 <template>...</template> 时，rollup 打包完浏览器运行时报错，所以先在这里写 template
  template: `
    <div style="margin: 20px;">
      <div>
        <button @click="pageName = '' ">clear</button>
        <button @click="pageName = 'simple' ">simple page</button>
        <button @click="pageName = 'basic' ">basic page</button>
      </div>
      <hr/>

      <Basic v-if="pageName === 'basic' "/>
      <Simple v-if="pageName === 'simple' "/>
    </div>
  `,

  components: { Basic, Simple },
  data() {
    return {
      pageName: ''
    }
  },
})
</script>