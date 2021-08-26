<script lang="ts">
import Vue from 'vue'
import * as wangEditor from '@wangeditor/editor-cattle'
import emitter from '../utils/emitter'
import { recordEditor } from '../utils/editor-map'

function genErrorInfo(fnName: string): string {
  let info = `请使用 '@${fnName}' 事件，不要放在 props 中`
  info += `\nPlease use '@${fnName}' event instead of props`
  return info
}

export default Vue.extend({
  //【注意】单独写 <template>...</template> 时，rollup 打包完浏览器运行时报错，所以暂用 render 编写
  render: function (h) {
    return h('div', { ref: 'box' })
  },

  name: 'Editor',
  props: ['editorId', 'defaultContent', 'defaultConfig', 'mode'],
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

      const defaultConfig = this.defaultConfig || {}

      wangEditor.createEditor({
        textareaSelector: this.$refs.box as Element,
        config: {
          ...defaultConfig,
          onCreated: (editor) => {
            // 记录 editor
            recordEditor(this.editorId, editor)

            // 触发自定义事件（如创建 toolbar）
            emitter.emit(`w-e-created-${this.editorId}`)

            this.$emit('onCreated', editor)
            if (defaultConfig.onCreated) {
              const info = genErrorInfo('onCreated')
              throw new Error(info)
            }
          },
          onChange: (editor) => {
            this.$emit('onChange', editor)
            if (defaultConfig.onChange) {
              const info = genErrorInfo('onChange')
              throw new Error(info)
            }
          },
          onDestroyed: (editor) => {
            this.$emit('onDestroyed', editor)
            if (defaultConfig.onDestroyed) {
              const info = genErrorInfo('onDestroyed')
              throw new Error(info)
            }
          },
          onMaxLength: (editor) => {
            this.$emit('onMaxLength', editor)
            if (defaultConfig.onMaxLength) {
              const info = genErrorInfo('onMaxLength')
              throw new Error(info)
            }
          },
          onFocus: (editor) => {
            this.$emit('onFocus', editor)
            if (defaultConfig.onFocus) {
              const info = genErrorInfo('onFocus')
              throw new Error(info)
            }
          },
          onBlur: (editor) => {
            this.$emit('onBlur', editor)
            if (defaultConfig.onBlur) {
              const info = genErrorInfo('onBlur')
              throw new Error(info)
            }
          },
          customAlert: (info, type) => {
            this.$emit('customAlert', info, type)
            if (defaultConfig.customAlert) {
              const info = genErrorInfo('customAlert')
              throw new Error(info)
            }
          },
        },
        content: this.defaultContent || [],
        mode: this.mode || 'default',
      })
    }
  }
})
</script>
