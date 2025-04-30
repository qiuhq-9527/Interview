# 计算器前端测试文档

## 测试架构

本项目采用了以下测试架构：

- **Jest**: JavaScript 测试框架
- **React Testing Library**: React 组件测试工具
- **@testing-library/jest-dom**: 提供额外的 DOM 断言

## 测试范围

项目测试覆盖了以下几个方面：

### 1. 数据模型测试

`src/models/__tests__/CalculatorModel.test.ts` 包含了对计算器数据模型的测试：

- 验证初始状态属性

### 2. 视图模型测试

`src/viewmodels/__tests__/CalculatorViewModel.test.ts` 包含了对计算器视图模型的测试：

- 状态初始化
- 数字输入功能
- 清除显示功能
- 切换正负号功能
- 执行计算操作
- API 调用逻辑

### 3. UI 组件测试

`src/components/__tests__/Calculator.test.tsx` 包含了对计算器组件的测试：

- 组件渲染
- 按钮点击事件
- 键盘事件处理
- 组件与视图模型的交互

### 4. API 客户端测试

`src/api/__tests__/calculatorClient.test.ts` 包含了对 API 客户端的测试：

- API 请求的正确格式
- 成功响应处理
- 错误响应处理
- 请求对象创建

## 测试策略

项目采用了以下测试策略：

### 1. 单元测试

测试单个组件和函数，确保它们在隔离环境中正常工作。

### 2. 集成测试

测试多个组件和服务之间的交互，确保它们能够正确协同工作。

### 3. 模拟外部依赖

- 使用 Jest 的模拟功能模拟 API 调用
- 模拟视图模型以测试 UI 组件
- 模拟全局对象，如 `window` 和 `fetch`

## 运行测试

### 安装依赖

```bash
npm install --legacy-peer-deps
```

### 运行测试

```bash
npm test
```

### 测试监视模式

```bash
npm run test:watch
```

### 测试覆盖率

```bash
npm test -- --coverage
```

## 编写新测试

添加新功能时，应该遵循以下测试原则：

1. 为每个新组件或功能编写测试
2. 测试正常行为和边界条件
3. 模拟外部依赖
4. 关注用户交互

## 测试文件命名约定

- 测试文件应该放在与被测试文件相同目录下的 `__tests__` 文件夹中
- 测试文件名应该以 `.test.ts` 或 `.test.tsx` 结尾
- 测试文件应该采用与被测试文件相同的名称 