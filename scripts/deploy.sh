#!/bin/bash

echo "开始部署。。。"

# 提交代码
git add .

git commit -m 'feat: 更换图片'

git push

# # 生成tag
# timestamp=$(date +%s)

# # echo $timestamp

# tagName="v.${timestamp}"

# git tag -a $tagName -m '更换图片'

# git push origin $tagName