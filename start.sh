#!/bin/bash

echo "=========================================="
echo "心衣间 (XinYiJian) App 启动脚本"
echo "=========================================="
echo ""

if [ ! -d "node_modules" ]; then
    echo "正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "安装失败，请检查网络连接"
        exit 1
    fi
fi

echo "启动开发服务器..."
npm run dev
