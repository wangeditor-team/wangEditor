#!/bin/bash

## 一键打包所有 package

# 获取 yarn dev/build 类型
buildType=build
if [ -n "$1" ]; then  
  buildType=$1
fi

cd ./packages

cd ./core
yarn "$buildType"

cd ../basic-modules
yarn "$buildType"

cd ../code-highlight
yarn "$buildType"

cd ../list-module
yarn "$buildType"

cd ../table-module
yarn "$buildType"

cd ../upload-image-module
yarn "$buildType"

cd ../video-module
yarn "$buildType"

cd ../editor
yarn "$buildType"

cd ../editor-for-react
yarn "$buildType"

cd ../editor-for-vue
yarn "$buildType"
