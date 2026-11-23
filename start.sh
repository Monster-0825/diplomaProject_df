#!/usr/bin/env bash
# 校园团购平台 - 一键启动前端（Vite 开发服务器）
set -e
cd "$(dirname "$0")"

# 检查 Node/npm
if ! command -v npm >/dev/null 2>&1; then
  echo "[错误] 未找到 npm，请先安装 Node.js：brew install node（或官网安装包）" >&2
  exit 1
fi

# 首次运行自动安装依赖
if [ ! -d node_modules ]; then
  echo ">>> 首次运行，安装依赖（约 1 分钟）..."
  npm install
fi

echo ">>> 启动前端开发服务器：http://localhost:5173"
npm run dev
