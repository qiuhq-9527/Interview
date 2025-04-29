# 计算器服务测试说明

本目录包含计算器服务的测试代码，包括单元测试和集成测试。

## 测试类型

1. **单元测试**: 测试计算器服务的核心功能，位于 `internal/calculator/service_test.go`
2. **集成测试**: 测试与实际运行的服务器的交互，位于 `tests/test_calculator.go`

## 运行单元测试

运行所有单元测试：

```bash
go test ./internal/...
```

运行计算器服务的单元测试并显示详细输出：

```bash
go test -v ./internal/calculator
```

## 运行集成测试

1. 首先启动服务器：

```bash
go run cmd/server/main.go
```

2. 在另一个终端窗口中运行集成测试：

```bash
go run tests/test_calculator.go
```

## 测试用例说明

### 单元测试用例

单元测试包括以下测试用例：

1. 基本算术运算：
   - 加法 (5 + 3 = 8)
   - 减法 (10 - 4 = 6)
   - 乘法 (7 * 6 = 42)
   - 除法 (20 / 5 = 4)

2. 错误处理：
   - 除零错误 (10 / 0)
   - 不支持的操作 (Operation_UNSPECIFIED)

3. 特殊情况：
   - 大数值处理 (检测溢出情况)
   - 浮点数精度问题 (1/3 * 3 ≈ 1)
   - 负数处理 (-10 / -5 = 2)

### 集成测试用例

集成测试验证实际服务的运行情况：

1. 加法运算：10 + 20 = 30
2. 除零错误处理：10 / 0 (预期返回错误信息)

## 测试覆盖率

检查测试覆盖率：

```bash
go test -cover ./internal/calculator
```

生成覆盖率报告：

```bash
go test -coverprofile=coverage.out ./internal/calculator
go tool cover -html=coverage.out
``` 