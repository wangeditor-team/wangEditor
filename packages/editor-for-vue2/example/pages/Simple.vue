<script lang="ts">
import Vue from 'vue'
import Editor from '../../src/components/Editor.vue'
import Toolbar from '../../src/components/Toolbar.vue'
import { getEditor, removeEditor } from '../../src/index'

export default Vue.extend({
  //【注意】单独写 <template>...</template> 时，rollup 打包完浏览器运行时报错，所以先在这里写 template
  template: `
    <div>
      <div style="border: 1px solid #ccc; margin-top: 10px;">
        <Toolbar :editorId="editorId" :defaultConfig="toolbarConfig"/>
      </div>

      <div style="border: 1px solid #ccc; margin-top: 10px;">
        <Editor
          :editorId="editorId"
          :defaultConfig="editorConfig"
          :initContent="initContent"
        />
      </div>
    </div>
  `,

  components: { Editor, Toolbar },
  data() {
    return {
      //【注意】1. editorId 用于 Toolbar 和 Editor 的关联，保持一直。2. 多个编辑器时，每个的 editorId 要唯一
      // TODO 文档中说明这一点
      editorId: 'w-e-1002',

      initContent: [
        { type: 'paragraph', children: [{ text: 'simple mode' }] },
        { type: 'paragraph', children: [{ text: '简化 toolbar ，禁用 hoverbar' }] }
      ],
      curContent: [],
      toolbarConfig: {
        // 简化 toolbar
        toolbarKeys: ['bold', 'italic', 'underline', 'code', '|', 'header1', 'header2', 'blockquote', '|', 'bulletedList', 'numberedList'],
      },
      editorConfig: {
        placeholder: '请输入内容123...',
        hoverbarKeys: [], // 禁用 hoverbar
      },
    }
  },
  mounted() {
  },
  methods: {
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
