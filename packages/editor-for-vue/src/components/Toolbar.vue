<script lang="ts">
import Vue from 'vue'
import wangEditor from '@wangeditor/editor'
import emitter from '../utils/emitter'
import { getEditor } from '../utils/editor-map'

export default Vue.extend({
  //【注意】单独写 <template>...</template> 时，rollup 打包完浏览器运行时报错，所以先在这里写 template
  template: '<div ref="box"></div>',

  name: 'Toolbar',
  props: ['editorId', 'defaultConfig', 'mode'],
  created() {
    if (this.editorId == null) {
      throw new Error('Need `editorId` props when create <Editor/> component')
    }
    // 当 editor 创建时，创建 toolbar
    emitter.on(`w-e-created-${this.editorId}`, this.create)
  },
  methods: {
    // 创建 toolbar
    create() {
      if (this.$refs.box == null) return

      const editor = getEditor(this.editorId)
      if (editor == null) return

      wangEditor.createToolbar({
        editor,
        toolbarSelector: this.$refs.box as Element,
        config: this.defaultConfig || {},
        mode: this.mode || 'default',
      })
    }
  },
  beforeDestroy() {
    // 组件销毁及时 off 自定义事件，防止内存泄漏
    emitter.off(`w-e-created-${this.editorId}`, this.create)
  },
})
</script>
