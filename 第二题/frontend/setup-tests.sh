#!/bin/bash

# 安装依赖
echo "正在安装依赖..."
npm install --legacy-peer-deps

# 修复可能的依赖问题
echo "修复React版本冲突..."
npm install --legacy-peer-deps --no-save react@19 react-dom@19

# 检查是否安装成功
echo "检查Jest..."
npx jest --version

echo "测试环境准备完成！现在可以运行测试:"
echo "npm test" 