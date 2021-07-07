<script lang="ts">
import Vue from 'vue'
import wangEditor from '@wangeditor/editor'
import emitter from '../utils/emitter'
import { recordEditor } from '../utils/editor-map'

function genErrorInfo(fnName: string): string {
  let info = `请使用 '@${fnName}' 事件，不要放在 props 中`
  info += `\nPlease use '@${fnName}' event instead of props`
  return info
}

export default Vue.extend({
  //【注意】单独写 <template>...</template> 时，rollup 打包完浏览器运行时报错，所以先在这里写 template
  template: '<div ref="box"></div>',

  name: 'Editor',
  props: ['editorId', 'initContent', 'config'],
  created() {
    if (this.editorId == null) {
      throw new Error('Need `editorId` props when create <Editor/> component')
    }
  },
  mounted() {
    this.create()
  },
  methods: {
    create() {
      if (this.$refs.box == null) return

      const config = this.config || {}

      wangEditor.createEditor({
        textareaSelector: this.$refs.box as Element,
        config: {
          ...config,
          onCreated: (editor) => {
            // 触发自定义事件（如创建 toolbar）
            emitter.emit(`w-e-created-${this.editorId}`, editor)

            // 记录 editor
            recordEditor(this.editorId, editor)

            this.$emit('onCreated', editor)
            if (config.onCreated) {
              const info = genErrorInfo('onCreated')
              throw new Error(info)
            }
          },
          onChange: (editor) => {
            this.$emit('onChange', editor)
            if (config.onChange) {
              const info = genErrorInfo('onChange')
              throw new Error(info)
            }
          },
          onDestroyed: (editor) => {
            this.$emit('onDestroyed', editor)
            if (config.onDestroyed) {
              const info = genErrorInfo('onDestroyed')
              throw new Error(info)
            }
          },
          onMaxLength: (editor) => {
            this.$emit('onMaxLength', editor)
            if (config.onMaxLength) {
              const info = genErrorInfo('onMaxLength')
              throw new Error(info)
            }
          },
          onFocus: (editor) => {
            this.$emit('onFocus', editor)
            if (config.onFocus) {
              const info = genErrorInfo('onFocus')
              throw new Error(info)
            }
          },
          onBlur: (editor) => {
            this.$emit('onBlur', editor)
            if (config.onBlur) {
              const info = genErrorInfo('onBlur')
              throw new Error(info)
            }
          },
        },
        initContent: this.initContent || [],
      })
    }
  }
})
</script>
