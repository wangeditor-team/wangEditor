#!/bin/bash

## 一键打包所有 package

# 获取 yarn dev/build 类型
buildType=build
if [ -n "$1" ]; then  
  buildType=$1
fi

cd ./packages

# core 要第一个打包
cd ./core
yarn "$buildType"

cd ../basic-modules
yarn "$buildType"

# code-highlight 依赖于 basic-modules 中的 code-block
cd ../code-highlight
yarn "$buildType"

cd ../list-module
yarn "$buildType"

cd ../table-module
yarn "$buildType"

# upload-image 依赖于 basic-modules 中的 image
cd ../upload-image-module
yarn "$buildType"

cd ../video-module
yarn "$buildType"

# editor 依赖于上述的 core + modules
cd ../editor
yarn "$buildType"

# react 组件依赖于 editor
cd ../editor-for-react
yarn "$buildType"

# vue 组件依赖于 editor
cd ../editor-for-vue
yarn "$buildType"
