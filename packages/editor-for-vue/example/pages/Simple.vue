<script lang="ts">
import Vue from 'vue'
import { getEditor, removeEditor, Editor, Toolbar } from '../../src/index'

export default Vue.extend({
  //【注意】单独写 <template>...</template> 时，rollup 打包完浏览器运行时报错，所以先在这里写 template
  template: `
    <div>
      <div style="border: 1px solid #ccc; margin-top: 10px;">
        <Toolbar :editorId="editorId" :defaultConfig="toolbarConfig" :mode="mode"/>
      </div>

      <div style="border: 1px solid #ccc; margin-top: 10px;">
        <Editor
          :editorId="editorId"
          :defaultConfig="editorConfig"
          :defaultContent="defaultContent"
          :mode="mode"
        />
      </div>
    </div>
  `,

  components: { Editor, Toolbar },
  data() {
    return {
      //【注意】1. editorId 用于 Toolbar 和 Editor 的关联，保持一直。2. 多个编辑器时，每个的 editorId 要唯一
      editorId: 'w-e-1002',

      defaultContent: [
        { type: 'paragraph', children: [{ text: 'simple mode' }] },
        { type: 'paragraph', children: [{ text: '简化 toolbar 和 hoverbar' }] }
      ],
      curContent: [],

      toolbarConfig: {
        // 工具栏配置
      },
      editorConfig: {
        placeholder: '请输入内容123...',
      },
      mode: 'simple',
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
