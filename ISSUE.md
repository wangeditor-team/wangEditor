# 当前遗留的一些问题

- 删除掉`./release`之后，执行`npm run release`会报错，原因是`fonts`文件没拷贝全，就要去替换`css`中的字体文件为`base64`格式，导致找不到文件。
- `Object.assign` 未被 rollup 编译
- 运行 demo，在一段未加粗的文字中，光标点击一下（此时 range 里面无内容），然后点击 B 菜单，此时光标显示了 —— 如何再显示出来？


