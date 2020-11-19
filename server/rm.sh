#!/bin/bash
# 删除上传的文件，用于 crontab 调用
# 每天凌晨 4 点调用：`0 4 * * * /home/work/wangEditor-team/wangEditor/server/rm.sh`

cd /home/work/wangEditor-team/wangEditor/server/upload-files # 测试机的 path
rm -rf *
