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
npm install --legacy-peer-deps
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

## 单元测试

项目使用 Jest 和 React Testing Library 进行单元测试。

### 测试环境设置

由于项目使用了 React 19，而一些测试库可能与此版本不完全兼容，我们提供了一个设置脚本来解决这些兼容性问题：

```bash
# 使脚本可执行
chmod +x setup-tests.sh

# 运行设置脚本
./setup-tests.sh
```

或者，您可以手动安装依赖：

```bash
npm install --legacy-peer-deps
```

### 测试覆盖范围

1. **模型测试**: 测试数据模型的初始状态
2. **视图模型测试**: 测试计算器功能的业务逻辑
3. **组件测试**: 测试UI组件的渲染和交互
4. **API客户端测试**: 测试与后端的通信

### 运行测试

执行所有测试：
```bash
npm test
```

持续监视模式（开发时推荐）：
```bash
npm run test:watch
```

### 测试文件位置

- 模型测试: `src/models/__tests__/*.test.ts`
- 视图模型测试: `src/viewmodels/__tests__/*.test.ts`
- 组件测试: `src/components/__tests__/*.test.tsx`
- API客户端测试: `src/api/__tests__/*.test.ts`

### 测试约定

- 每个测试文件应位于与被测代码相同的目录下的 `__tests__` 文件夹中
- 测试文件名应以 `.test.ts` 或 `.test.tsx` 结尾
- 使用 `describe` 块组织相关测试
- 使用 `test` 或 `it` 函数定义具体的测试用例
- 测试需要模拟外部依赖，如API调用和第三方库

## 错误处理

应用实现了全面的错误处理：

- API错误会在界面上明确显示
- 运算错误（如除以零）会显示适当的错误消息
- 网络问题会提供用户友好的错误提示
