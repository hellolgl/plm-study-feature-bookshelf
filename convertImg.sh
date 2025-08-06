#/bin/bash

# 指定要上传的文件所在的目录
directory="/Users/henry/Downloads/square"

# 遍历目录中的所有文件
for file in "$directory"/*
do
  # 如果文件存在且是一个普通文件
  if [ -f "$file" ]; then
    # 获取文件名
    filename=$(basename "$file")
    echo "$filename" 开始裁剪    
    convert "$file" -resize 512x512 "$file"
    
    # 检查上一条命令是否执行成功
    if [ $? -eq 0 ]; then
      echo "文件 $filename 裁剪成功。"
    else
      echo "文件 $filename 裁剪失败。"
    fi
  fi
done

exit 0
