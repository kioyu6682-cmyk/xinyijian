@echo off
echo ==========================================
echo 心衣间 (XinYiJian) App 启动脚本
echo ==========================================
echo.

if not exist node_modules (
    echo 正在安装依赖...
    npm install
    if errorlevel 1 (
        echo 安装失败，请检查网络连接
        pause
        exit /b 1
    )
)

echo 启动开发服务器...
npm run dev
pause
