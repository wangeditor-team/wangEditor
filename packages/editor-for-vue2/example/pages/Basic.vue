<script lang="ts">
import Vue from 'vue'
import Editor from '../../src/components/Editor.vue'
import Toolbar from '../../src/components/Toolbar.vue'
import { getEditor, removeEditor } from '../../src/index'

export default Vue.extend({
  //【注意】单独写 <template>...</template> 时，rollup 打包完浏览器运行时报错，所以先在这里写 template
  template: `
    <div>
      <div>
        <button @click="onToggleReadOnly">toggle readOnly</button>
        <button @click="onGetHtml">get html</button>
      </div>

      <div style="border: 1px solid #ccc; margin-top: 10px;">
        <Toolbar :editorId="editorId" :defaultConfig="toolbarConfig"/>
      </div>

      <div style="border: 1px solid #ccc; margin-top: 10px;">
        <Editor
          :editorId="editorId"
          :defaultConfig="editorConfig"
          :defaultContent="defaultContent"
          @onCreated="onCreated"
          @onChange="onChange"
          @onDestroyed="onDestroyed"
          @onMaxLength="onMaxLength"
          @onFocus="onFocus"
          @onBlur="onBlur"
          @customAlert="customAlert"
        />
      </div>

      <div style="border: 1px solid #ccc; margin-top: 10px;">
        <pre v-html="curContentStr"></pre>
      </div>
    </div>
  `,

  components: { Editor, Toolbar },
  data() {
    return {
      //【注意】1. editorId 用于 Toolbar 和 Editor 的关联，保持一致。2. 多个编辑器时，每个的 editorId 要唯一
      // TODO 文档中说明这一点
      editorId: 'w-e-1001',

      toolbarConfig: {},
      defaultContent: [{ type: 'paragraph', children: [{ text: 'basic demo' }] }],
      editorConfig: {
        placeholder: '请输入内容123...',
        // 菜单配置
        MENU_CONF: {
          uploadImage: {
            server: 'http://106.12.198.214:3000/api/upload-img', // 上传图片地址
            fieldName: 'vue2-demo-fileName',
          },
          insertImage: {
            checkImage(src: string, alt: string, href: string): boolean | string | undefined {
              if (src.indexOf('http') !== 0) {
                return '图片网址必须以 http/https 开头'
              }
              return true
            }
          }
        }
      },
      curContent: [],
    }
  },
  computed: {
    curContentStr() {
      // @ts-ignore
      return JSON.stringify(this.curContent, null, 2)
    },
  },
  mounted() {
  },
  methods: {
    //【注意】vue2 和 React 不一样，无法在 props 传递事件，所以 callbacks 只能单独定义，通过事件传递
    onCreated(editor) {
      console.log('onCreated', editor)
      // this.editor = editor
    },
    onChange(editor) {
      console.log('onChange', editor.children)
      this.curContent = editor.children
    },
    onDestroyed(editor) {
      console.log('onDestroyed', editor)
    },
    onMaxLength(editor) {
      console.log('onMaxLength', editor)
    },
    onFocus(editor) {
      console.log('onFocus', editor)
    },
    onBlur(editor) {
      console.log('onBlur', editor)
    },
    customAlert(info: string, type: string) {
      window.alert(`customAlert in Vue2 demo\n${type}:\n${info}`)
    },

    onToggleReadOnly() {
      const editor = getEditor(this.editorId)
      if (editor == null) return

      // 修改 editor 配置
      editor.setConfig({
        readOnly: !editor.getConfig().readOnly
      })
    },
    onGetHtml() {
      const editor = getEditor(this.editorId)
      if (editor == null) return

      // 使用 editor API
      console.log(editor.getHtml())
    },
  },

  // 及时销毁 editor
  beforeDestroy() {
    const editor = getEditor(this.editorId)
    if (editor == null) return

    // 销毁，并移除 editor
    editor.destroy()
    removeEditor(this.editorId)
  }
})
</script>
