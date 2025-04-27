# 计算器后端服务

这是一个基于Go和ConnectRPC实现的计算器服务，支持基础的加减乘除运算。

## 项目结构

```
/backend
├── api/calculator/       # API定义
│   └── calculator.proto  # Protobuf服务定义
├── cmd/server/          # 服务入口
│   └── main.go          # 主程序
├── docs/                # 文档
│   └── api.md           # API文档
├── internal/service/    # 服务实现
│   ├── calculator.go    # 计算器服务实现
│   └── calculator_test.go # 单元测试
├── gen.sh              # 代码生成脚本
├── go.mod              # Go模块定义
└── README.md           # 项目说明
```

## 安装与运行

### 前置条件

- Go 1.18+
- Protocol Buffers编译器 (protoc)

### 安装依赖

```bash
# 安装必要的工具
go install github.com/bufbuild/buf/cmd/buf@latest
go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latest
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install github.com/bufbuild/connect-go/cmd/protoc-gen-connect-go@latest

# 安装项目依赖
go mod tidy
```

### 生成代码

```bash
# 生成ConnectRPC代码
protoc --go_out=. --connect-go_out=. api/calculator/calculator.proto
```

### 运行服务

```bash
# 启动服务器
go run cmd/server/main.go
```

服务将在 http://localhost:8080 上启动。

### 运行测试

```bash
go test ./internal/service/...
```

## API使用

详细的API文档请参考 [API文档](docs/api.md)。

## 前端集成

前端应用可以通过ConnectRPC协议与后端服务通信。服务支持CORS，允许从http://localhost:3000（前端开发服务器）发起的请求。

## 注意事项

- 本服务仅支持基础的加减乘除运算
- 除法运算会检查除数是否为零，如果是则返回错误
- 所有计算使用双精度浮点数