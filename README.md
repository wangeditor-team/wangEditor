
# wangEditor

## 介绍

**wangEditor** —— 轻量级 web 富文本编辑器，配置方便，使用简单。支持 IE10+ 浏览器。

- 官网：[www.wangEditor.com](http://www.wangeditor.com/)
- 文档：[www.kancloud.cn/wangfupeng/wangeditor3/332599](http://www.kancloud.cn/wangfupeng/wangeditor3/332599)
- 源码：[github.com/wangfupeng1988/wangEditor](https://github.com/wangfupeng1988/wangEditor) （欢迎 star）

![图片](http://images2015.cnblogs.com/blog/138012/201705/138012-20170530202905633-1840158981.png)

*查看 v2 版本的代码和文档点击[这里](https://github.com/wangfupeng1988/wangEditor/tree/v2)*


## 下载

- 直接下载：[https://github.com/wangfupeng1988/wangEditor/releases](https://github.com/wangfupeng1988/wangEditor/releases)
- 使用`npm`下载：`npm install wangeditor` （注意 `wangeditor` 全部是**小写字母**）
- 使用`bower`下载：`bower install wangEditor` （前提保证电脑已安装了`bower`）
- 使用CDN：[//unpkg.com/wangeditor/release/wangEditor.min.js](https://unpkg.com/wangeditor/release/wangEditor.min.js)


## 使用

```javascript
var E = window.wangEditor
var editor = new E('#div1')
editor.create()
```


## 运行 demo

- 下载源码 `git clone git@github.com:wangfupeng1988/wangEditor.git`
- 安装或者升级最新版本 node（最低`v6.x.x`）
- 进入目录，安装依赖包 `cd wangEditor && npm i`
- 安装包完成之后，windows 用户运行`npm run win-example`，Mac 用户运行`npm run example`
- 打开浏览器访问[localhost:3000/index.html](http://localhost:3000/index.html)
- 用于 React、vue 或者 angular 可查阅[文档](http://www.kancloud.cn/wangfupeng/wangeditor3/332599)中[其他](https://www.kancloud.cn/wangfupeng/wangeditor3/335783)章节中的相关介绍

## 交流

### QQ 群

以下 QQ 群欢迎加入交流问题（可能有些群已经满员）

- 164999061
- 281268320

### 提问

注意，作者只受理以下几种提问方式，其他方式直接忽略

- 直接在 [github issues](https://github.com/wangfupeng1988/wangEditor/issues) 提交问题
- 去[知乎](https://www.zhihu.com/)提问，并邀请[作者](https://www.zhihu.com/people/wang-fu-peng-54/activities)来回答
- 去[segmentfault](https://segmentfault.com)提问，并邀请[作者](https://segmentfault.com/u/wangfupeng1988)来回答

每次升级版本修复的问题记录在[这里](./ISSUE.md)

## 关于作者

- 关注作者的博客 - 《[深入理解javascript原型和闭包系列](http://www.cnblogs.com/wangfupeng1988/p/4001284.html)》《[深入理解javascript异步系列](https://github.com/wangfupeng1988/js-async-tutorial)》《[换个思路学习nodejs](https://github.com/wangfupeng1988/node-tutorial)》《[CSS知多少](http://www.cnblogs.com/wangfupeng1988/p/4325007.html)》 
- 学习作者的教程 - 《[前端JS高级面试](https://coding.imooc.com/class/190.html)》《[前端JS基础面试题](http://coding.imooc.com/class/115.html)》《[React.js模拟大众点评webapp](http://coding.imooc.com/class/99.html)》《[zepto设计与源码分析](http://www.imooc.com/learn/745)》《[json2.js源码解读](http://study.163.com/course/courseMain.htm?courseId=691008)》

如果你感觉有收获，欢迎给我打赏 ———— 以激励我更多输出优质开源内容

![图片](https://camo.githubusercontent.com/e1558b631931e0a1606c769a61f48770cc0ccb56/687474703a2f2f696d61676573323031352e636e626c6f67732e636f6d2f626c6f672f3133383031322f3230313730322f3133383031322d32303137303232383131323233373739382d313530373139363634332e706e67)

