#!/bin/bash

## 拷贝 demo 到服务器

localPath="./packages/editor"
serverPath="work@106.12.198.214:~/wangEditor-team/v5-examples/editor"
scp -r $localPath/dist $serverPath
scp -r $localPath/examples $serverPath
