# 当前遗留的一些问题

- 删除掉`./release`之后，执行`npm run release`会报错，原因是`fonts`文件没拷贝全，就要去替换`css`中的字体文件为`base64`格式，导致找不到文件。

