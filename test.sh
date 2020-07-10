#!/bin/bash

# 获取当前分支
b=`git branch | awk '$1 == "*"{print $2}'`

echo $b
