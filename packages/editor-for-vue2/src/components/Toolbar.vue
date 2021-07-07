<script lang="ts">
import Vue from 'vue'
import wangEditor from '@wangeditor/editor'
import emitter from '../utils/emitter'

export default Vue.extend({
  //【注意】单独写 <template>...</template> 时，rollup 打包完浏览器运行时报错，所以先在这里写 template
  template: '<div ref="box"></div>',

  name: 'Toolbar',
  props: ['editorId', 'config'],
  created() {
    if (this.editorId == null) {
      throw new Error('Need `editorId` props when create <Editor/> component')
    }
    // 监听 editor 创建
    emitter.on(`w-e-created-${this.editorId}`, this.create)
  },
  methods: {
    // 创建 toolbar
    create(editor) {
      if (editor == null) return
      if (this.$refs.box == null) return

      wangEditor.createToolbar({
        editor,
        toolbarSelector: this.$refs.box as Element,
        config: this.config || {},
      })
    }
  },
  beforeDestroy() {
    // 组件销毁及时 off 自定义事件，防止内存泄漏
    emitter.off(`w-e-created-${this.editorId}`, this.create)
  },
})
</script>
