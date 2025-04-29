# 计算器后端服务

这是一个基于 Go 和 ConnectRPC 实现的计算器后端服务，支持基础的加减乘除运算。

## 技术栈

- Go 1.24+
- ConnectRPC
- Protocol Buffers
- HTTP/2

## 项目结构

```
backend/
├── api/             # 生成的API代码
│   └── calculatorv1/  # 计算器服务API
├── cmd/             # 命令行入口
│   └── server/      # 服务器入口
├── internal/        # 内部实现
│   └── calculator/  # 计算器服务实现
├── proto/           # Protocol Buffers 定义
│   └── calculator/
│       └── v1/      # API 版本 1
├── tests/           # 测试代码
├── buf.gen.yaml     # Buf 生成配置
└── buf.yaml         # Buf 配置文件
```

## 环境要求

1. Go 1.24 或更高版本
2. Protocol Buffers 编译器 (protoc)
3. Buf 工具

## 安装依赖

1. 安装 Go 依赖：
```bash
go mod download
```

2. 安装 Protocol Buffers 工具：
```bash
# macOS
brew install protobuf

# Linux
apt-get install protobuf-compiler
```

3. 安装 Buf 和 protoc 插件：
```bash
go install github.com/bufbuild/buf/cmd/buf@latest
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install connectrpc.com/connect/cmd/protoc-gen-connect-go@latest
```

## 生成代码

在项目根目录下运行：
```bash
export PATH=$PATH:$(go env GOPATH)/bin
buf generate proto/calculator/v1/calculator.proto
```

## 运行服务

1. 直接运行：
```bash
go run cmd/server/main.go
```

2. 构建并运行：
```bash
go build -o calculator-server cmd/server/main.go
./calculator-server
```

服务默认运行在 8080 端口，可以通过环境变量 PORT 修改端口：
```bash
PORT=3000 go run cmd/server/main.go
```

## 测试服务

1. 启动服务器：
```bash
go run cmd/server/main.go
```

2. 在另一个终端中运行测试客户端：
```bash
go run tests/test_calculator.go
```

## API 说明

服务提供以下 RPC 方法：

- `Calculate`: 执行基础算术运算
  - 支持的操作：加(1)、减(2)、乘(3)、除(4)
  - 输入：两个操作数和一个操作符
  - 输出：计算结果或错误信息

### 示例请求（使用Connect协议）

```go
req := connect.NewRequest(&calculatorv1.CalculateRequest{
    FirstOperand:  10,
    SecondOperand: 5,
    Operation:     calculatorv1.Operation_OPERATION_ADD,
})
res, err := client.Calculate(context.Background(), req)
```

## 注意事项

1. 服务默认允许所有来源的 CORS 请求，生产环境应该限制允许的域名
2. 服务使用 HTTP/2 协议，确保客户端支持 HTTP/2
3. 除法运算会检查除数为零的情况 