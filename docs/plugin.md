# 插件注册

插件注册分为两种，一种是全局注册，一种是局部注册。

两种注册的形式是一样的，只是载体不一样。

## 注册参数

插件注册方法接收两个参数，分别是：name 和 options

name 是字符串类型，代表着插件的名称

options 是对象类型，代表着注册的插件相关的配置

options 中有一个必填参数和一个选填参数，分别为：intention 和 config

intention 是函数类型，代表着插件的执行函数，也就是插件具体的业务逻辑行为，该函数接收两个参数，一个是编辑器实例对象，一个是 config 参数

config 是任意类型，代表着插件的配置，在初始化插件的时候，该配置将会作为 intention 插件的执行函数的第二个参数传入

## 全局注册

全局注册需要在 wangEditor 的构造函数上进行注册，示例代码如下：

```
import wangEditor from 'wangEditor'

wangEditor.registerPlugin('plugin', {
    intention: function (editor, config) {
        // 业务代码
    },
    confgi: { ... } // 插件配置
})

const editor = new wangEditor('box')

editor.create()

```

## 局部注册

局部注册需要在 wangEditor 的实例上进行注册，示例代码如下：

```
import wangEditor from 'wangEditor'

wangEditor.registerPlugin('plugin', {
    intention: function (editor, config) {
        // 业务代码
    },
    confgi: { ... } // 插件配置
})

const editor = new wangEditor('box')

editor.registerPlugin('plugin2', {
    intention: function (editor, config) {
        // 业务代码
    },
    confgi: { ... } // 插件配置
})

editor.create()

```
