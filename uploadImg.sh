#/bin/bash

# 指定要上传的文件所在的目录
directory="/Users/henry/Downloads/square"

# 指定OSS的目标路径
oss_bucket="oss://pailaimi-static/paixiaoxue/square/"

# 遍历目录中的所有文件
for file in "$directory"/*
do
  # 如果文件存在且是一个普通文件
  if [ -f "$file" ]; then
    # 获取文件名
    filename=$(basename "$file")
    echo "$filename" 开始上传    
    # 使用ossutil cp命令将文件复制到OSS
    oss cp "$file" "${oss_bucket}${filename}"
    
    # 检查上一条命令是否执行成功
    if [ $? -eq 0 ]; then
      echo "文件 $filename 已成功上传到 OSS。"
    else
      echo "文件 $filename 上传到 OSS 时出错。"
    fi
  fi
done

exit 0
