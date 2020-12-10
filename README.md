# wangEditor

![build badge](https://github.com/wangeditor-team/wangEditor/workflows/build/badge.svg)

轻量级 web 富文本编辑器，配置方便，使用简单。

- 官网 [www.wangEditor.com](http://www.wangeditor.com/)
- 文档 [www.wangEditor.com/doc](http://www.wangeditor.com/doc/)

![](./docs/imgs/demo.png)

当前是 `v4` 版本。想继续使用 `v3` 版本看[这里](http://www.wangeditor.com/doc/pages/01-%E5%BC%80%E5%A7%8B%E4%BD%BF%E7%94%A8/08-%E4%BD%BF%E7%94%A8V3%E7%89%88%E6%9C%AC.html)。

## 浏览器兼容性

兼容常见的 PC 浏览器：Chrome，Firefox，Safar，Edge，QQ 浏览器，IE11 。

不支持移动端。

## 基本使用

### NPM
```bash
npm i wangeditor --save
```
安装后几行代码即可创建一个编辑器：

```js
import E from "wangeditor";
const editor = new E("#div1");
editor.create();
```
### CDN
```html
<script type="text/javascript" src="https://unpkg.com/wangeditor/dist/wangEditor.min.js"></script>
<script type="text/javascript">
  const E = window.wangEditor
  const editor = new E('#div1')
  // 或者 const editor = new E(document.getElementById('div1'))
  editor.create()
</script>
```

更多使用方法，可参考[文档](http://www.wangeditor.com/doc/)。

## 交流

加入 QQ 群
- 164999061（人已满）
- 710646022（人已满）
- 901247714

提交 bug 或建议
- [github issues](https://github.com/wangeditor-team/wangeditor/issues) 提交问题

## 开发团队

有专业[开发团队](http://www.wangeditor.com/doc/#%E5%BC%80%E5%8F%91%E4%BA%BA%E5%91%98)维护，非个人单兵作战。

想加入 wangEditor 研发团队，可申请加入 QQ 群，然后私聊群主。

## 开发文档

[开发文档](./docs/README.md)，供申请加入开发团队，或者对源码感兴趣的用户阅读。

加入开发团队后，还会有更详细的开发流程、规划、沟通机制。内容太多，这里不公开。

## 为我们加油

你的支持，将激励我们输出更多优质内容！

![](./docs/imgs/wechat-pay.jpeg)
![](./docs/imgs/ali-pay.jpeg)
