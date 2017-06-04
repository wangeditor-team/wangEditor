<template>
    <div>
        <div id="editorElem" style="text-align:left"></div>
        <button v-on:click="getContent">查看内容</button>
    </div>
</template>

<script>
    import E from 'wangeditor'

    export default {
      name: 'editor',
      data () {
        return {
        }
      },
      methods: {
        getContent: function () {
            var editor = this.editor
            alert(editor.txt.html())
        }
      },
      mounted() {
        var editor = new E('#editorElem')
        editor.create()

        this.editor = editor
      }
    }
</script>

<style scoped>
</style>