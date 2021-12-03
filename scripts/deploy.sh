#!/bin/bash

echo "开始部署。。。"

git add .

git commit -m 'feat: 更换图片'

git push

current=`date "+%Y-%m-%d %H:%M:%S"`  
timeStamp=`date -d "$current" +%s`


git tag -a $timeStamp -m '更换图片'

git push origin $timeStamp