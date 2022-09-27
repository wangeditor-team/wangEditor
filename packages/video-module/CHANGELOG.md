# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.1.4](https://github.com/wangeditor-team/wangEditor/compare/@wangeditor/video-module@1.1.3...@wangeditor/video-module@1.1.4) (2022-09-27)

**Note:** Version bump only for package @wangeditor/video-module





## [1.1.3](https://github.com/wangeditor-team/wangEditor/compare/@wangeditor/video-module@1.1.2...@wangeditor/video-module@1.1.3) (2022-09-15)


### Bug Fixes

* customInsert 不触发 onSuccess ([d6f4a1b](https://github.com/wangeditor-team/wangEditor/commit/d6f4a1b1494864b116a1310cce2d9e8632c92c6f))
* 上传视频 - customBrowseAndUpload 缺少 poster ([c24627a](https://github.com/wangeditor-team/wangEditor/commit/c24627aaa4c173c5d435e3077dfe8f6b4a9a87b1))





## [1.1.2](https://github.com/wangeditor-team/wangEditor/compare/@wangeditor/video-module@1.1.1...@wangeditor/video-module@1.1.2) (2022-08-30)


### Bug Fixes

* checkVideo 增加 poster 参数 ([c0402e1](https://github.com/wangeditor-team/wangEditor/commit/c0402e155470233d256e037d863dab74c026b7f6))





## [1.1.1](https://github.com/wangeditor-team/wangEditor/compare/@wangeditor/video-module@1.1.0...@wangeditor/video-module@1.1.1) (2022-07-14)


### Bug Fixes

* video poster（不想升级大版本，所有暂用 fix 不用 feature） ([5a2aff9](https://github.com/wangeditor-team/wangEditor/commit/5a2aff92bc23f240bd249a7294874940cfc9f717))





# [1.1.0](https://github.com/wangeditor-team/wangEditor/compare/@wangeditor/video-module@1.0.1...@wangeditor/video-module@1.1.0) (2022-05-25)


### Features

* editVideoSize ([375eecb](https://github.com/wangeditor-team/wangEditor/commit/375eecba826eac681268c55c47bcd922f7157d63))
* enter menu ([988fc31](https://github.com/wangeditor-team/wangEditor/commit/988fc31f31de3d37dffbf54abb784cceb8e6118d))
* setHtml ([f4f91b8](https://github.com/wangeditor-team/wangEditor/commit/f4f91b883298091e3679ca6b206ae0d796003772))
* 表格拖拽列宽 ([46ea2c0](https://github.com/wangeditor-team/wangEditor/commit/46ea2c0f831b03ebca5fddfd59d682fed0b3476e))





## 1.0.1 (2022-04-18)


### Bug Fixes

* 部分菜单 disabled ([87f1233](https://github.com/wangeditor-team/wangEditor/commit/87f12332a087072406c1988dc5cef2eae8335375))
* 插入图片的 < > 替换 ([5721560](https://github.com/wangeditor-team/wangEditor/commit/57215609ada8b9d15f5505d1ba52e49707b5b183))
* 更新各包之间依赖版本 ([75c552c](https://github.com/wangeditor-team/wangEditor/commit/75c552cc8ed54765bebb86a7ec5329a7fc79e85f))
* 修复 pnpm 安装 @wangeditor/editor 出现警告的问题 ([4087fbe](https://github.com/wangeditor-team/wangEditor/commit/4087fbee01c76bdd55e747a5e86c5e4a8d6a8353))
* 修复视频无法被xml-formatter解析的问题 ([e081518](https://github.com/wangeditor-team/wangEditor/commit/e08151863628e0241fe4a3d5858cda4c8ea57949)), closes [#101](https://github.com/wangeditor-team/wangEditor/issues/101) [#95](https://github.com/wangeditor-team/wangEditor/issues/95) [#70](https://github.com/wangeditor-team/wangEditor/issues/70) [#69](https://github.com/wangeditor-team/wangEditor/issues/69)
* 移除了每个包下的 publishConfig directory 配置 ([16559f0](https://github.com/wangeditor-team/wangEditor/commit/16559f052545c111318be760e64291a521bdcc65))
* fix插入视频报错的问题 ([f78b06d](https://github.com/wangeditor-team/wangEditor/commit/f78b06d7f75c288f306f04fbfec1dfeb1332a861))
* fix视频插入iframe时报错的问题 ([ad8f9ce](https://github.com/wangeditor-team/wangEditor/commit/ad8f9cea0f7eae1cb0bc51dba64585be05dfda2f))
* menu active ([10829e2](https://github.com/wangeditor-team/wangEditor/commit/10829e2e9e1d864d4900821ee3d5fa516b8cca2a))
* parse html - v4 video ([8dca822](https://github.com/wangeditor-team/wangEditor/commit/8dca822f9f1b52fd71dd6e17f0954d6aa016324b))
* rename es module filename ([1821d4e](https://github.com/wangeditor-team/wangEditor/commit/1821d4eef49e64efcb41b848849ca7a5e6472044))
* shadow dom 中 modal 输入框异常 ([ef3b199](https://github.com/wangeditor-team/wangEditor/commit/ef3b199a3e74c6b8ba61ed781e1aa13a1c5acfde))
* table - elemToHtml ([e36e609](https://github.com/wangeditor-team/wangEditor/commit/e36e6092ef721723169afc8bf0560a47ac9f4dfc))
* video - 键盘删除 ([5a6bedd](https://github.com/wangeditor-team/wangEditor/commit/5a6bedd80fa0d758270731f62115637ad7f313d0))


### Features

* 增加 enable disable API（删除 setConfig setMenuConfig API） ([984fc50](https://github.com/wangeditor-team/wangEditor/commit/984fc50520061fc34ea08f4136bdeb93dee46564))
* i18n ([c11b244](https://github.com/wangeditor-team/wangEditor/commit/c11b2440f91b99d40bca18b675c66a22b6e160c9))
* parse html ([2a5eace](https://github.com/wangeditor-team/wangEditor/commit/2a5eace00f33cded50b68e8164748ec2480213fd))
* parse src (link image video) ([715a841](https://github.com/wangeditor-team/wangEditor/commit/715a841fc6c730ee2b448a1799a07ce778128aad))
* toHtml 机制 ([1c4d872](https://github.com/wangeditor-team/wangEditor/commit/1c4d8729f84aaab6a448f23064b34a20596305e9))
* upload video ([ac8e6f8](https://github.com/wangeditor-team/wangEditor/commit/ac8e6f8b5258e593714676a6f6be359ba525833c))
* video menu config ([7fa3783](https://github.com/wangeditor-team/wangEditor/commit/7fa3783c42aa83f7d53c8be34be3c8b7c8a64754))
