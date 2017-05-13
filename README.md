
# wangEditor v3.0.0

支持 IE10 及以上浏览器

下载源码 `git clone git@github.com:wangfupeng1988/wangEditor.git -b v3`

进入目录，安装依赖 `cd wangEditor && npm i`

打包源代码 `npm run release` **(注意查看`./gulpfile.js`，打包时，`font`文件会以`base64`编码嵌入到`css`中，然后`css`内容再嵌入`js`中。因此，使用者引用时，只需要引用一个`js`文件即可)**

查看 demo `npm run exapmle` 然后浏览器访问 `localhost:3000/index.html`

