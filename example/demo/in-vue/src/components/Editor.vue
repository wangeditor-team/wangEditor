<template>
    <div id="wangeditor">
        <div ref="editorElem" style="text-align:left"></div>
    </div>
</template>

<script>
    import E from 'wangeditor'

    export default {
        name: 'editorElem',
        data() {
            return {
                editorObj: '', // 新增一个变量用来接收实例化对象
                editorContent: ''
            }
        },
        // 接收父组件传过来的值，实现富文本赋值和清空的操作。
        props: ['catchData', initData'],
        watch: {
            initData(val){
                // 父组件赋值initData为空及为清空操作，否则则为赋值操作。
                if(!val){
                    this.editorObj.txt.clear();
                }else{
                    this.editorObj.txt.html(val);
                }
            }
        },
        mounted() {
            // 将实例化对象赋值给变量editorObj,方便使用。
            this.editorObj = new E(this.$refs.editorElem);
            var editor = this.editorObj;
            editor.customConfig.onchange = (html) => {
                this.editorContent = html;
                //把这个html通过catchData的方法传入父组件
                this.catchData(html);
            };
            editor.create();
            // 根据父组件传过来的值，在初始化富文本器的时候首次赋值。
            this.editorObj.txt.html(this.initData);
        }
    }
</script>
