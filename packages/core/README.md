# wangEditor core

[wangEditor](https://www.wangeditor.com/v5/) 核心模块，代码量大，复杂度高。

## 主要依赖

- [slate.js](https://docs.slatejs.org/) 为编辑器内核（不依赖 React）
- [snabbdom.js](https://github.com/snabbdom/snabbdom) 做 vdom 渲染

## 主要实现了

- 编辑区域 view （ model -> vdom -> DOM ）和 selection
- menu + toolbar + hoverbar ，以及各种形式的菜单
- module 注册机制，以扩展第三方菜单、渲染逻辑、插件等

## 可以用来

- 注册第三方 module 扩展功能，可参考 packages/editor 中注册各个 module 的代码
- 创建编辑器，并提供必要的 API 和事件
