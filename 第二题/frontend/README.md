# 计算器前端应用

这是一个使用 Next.js 和 ConnectRPC 实现的仿苹果桌面端计算器应用，采用 MVVM 架构设计。

## 技术栈

- Next.js 15.x
- React 19.x
- ConnectRPC
- TailwindCSS 4.x
- TypeScript

## 功能特点

- 基本的加减乘除功能
- 支持键盘操作
- 响应式设计
- 苹果风格的UI界面
- 与后端服务实时计算

## 目录结构

```
frontend/
├── src/
│   ├── api/           # API客户端
│   ├── app/           # 页面组件
│   ├── components/    # UI组件
│   ├── gen/           # 生成的ConnectRPC代码
│   ├── models/        # 数据模型
│   └── viewmodels/    # 视图模型
├── proto/            # Protocol Buffers 定义
└── public/           # 静态资源
```

## 快速开始

1. 确保后端服务已经启动并运行在 http://localhost:8080

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

4. 在浏览器中访问 http://localhost:3000

## 使用方法

- 点击数字和操作符按钮进行计算
- 点击 `=` 按钮获取结果
- 点击 `AC` 按钮清除计算器状态
- 点击 `±` 按钮切换正负号
- 点击 `%` 按钮将数值转换为百分比

### 键盘快捷键

- 数字键 `0-9`: 输入数字
- 运算符 `+`, `-`, `*`, `/`: 执行对应的运算
- `Enter` 或 `=`: 计算结果
- `Escape` 或 `Delete`: 清除计算器状态
- `.`: 输入小数点

## 架构说明

本项目采用 MVVM (Model-View-ViewModel) 架构：

- **Model**: 定义在 `src/models/CalculatorModel.ts` 中，包含计算器的状态
- **ViewModel**: 定义在 `src/viewmodels/CalculatorViewModel.ts` 中，处理业务逻辑和状态管理
- **View**: 由 `src/components/` 目录下的组件构成，包括 Calculator、CalcButton 和 CalcDisplay

## 与后端集成

前端通过 ConnectRPC 与后端服务进行通信，API 客户端配置在 `src/api/calculatorClient.ts` 中。所有计算操作都会发送到后端进行处理，然后将结果返回给前端显示。
