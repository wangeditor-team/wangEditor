<template>
  <div id="app">
    <img src="./assets/logo.png">
    <hello></hello>
    <editor :catchData="catchData" :init-data="content"></editor>
  </div>
</template>

<script>
import Hello from './components/Hello'
import Editor from './components/Editor'

export default {
  name: 'app',
  data: {
    content: '' // 该变量用于负责清空或者赋值富文本内容。
  },
  components: {
    Hello,
    Editor
  },
  methods: {
    // 随时更新富文本输入的内容
    catchData(val){
      this.communityForm.content = val;
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
