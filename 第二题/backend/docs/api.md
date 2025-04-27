# 计算器服务 API 文档

## 概述

计算器服务提供基础的数学运算功能，包括加法、减法、乘法和除法。服务基于 ConnectRPC 协议实现，支持高效的二进制传输和类型安全的 API 调用。

## 服务定义

服务定义在 `api/calculator/calculator.proto` 文件中，使用 Protocol Buffers 语法。

```protobuf
service CalculatorService {
  rpc Add(CalculateRequest) returns (CalculateResponse);
  rpc Subtract(CalculateRequest) returns (CalculateResponse);
  rpc Multiply(CalculateRequest) returns (CalculateResponse);
  rpc Divide(CalculateRequest) returns (CalculateResponse);
}
```

## 消息格式

### 请求消息

```protobuf
message CalculateRequest {
  double a = 1;
  double b = 2;
}
```

- `a`: 第一个操作数
- `b`: 第二个操作数

### 响应消息

```protobuf
message CalculateResponse {
  double result = 1;
  string error = 2;
}
```

- `result`: 计算结果
- `error`: 错误信息，如果操作成功则为空

## API 端点

服务运行在 `http://localhost:8080/calculator.CalculatorService/`，支持以下操作：

### 加法

- 端点: `/calculator.CalculatorService/Add`
- 方法: POST
- 请求体: CalculateRequest
- 响应: CalculateResponse
- 说明: 计算 a + b 的结果

### 减法

- 端点: `/calculator.CalculatorService/Subtract`
- 方法: POST
- 请求体: CalculateRequest
- 响应: CalculateResponse
- 说明: 计算 a - b 的结果

### 乘法

- 端点: `/calculator.CalculatorService/Multiply`
- 方法: POST
- 请求体: CalculateRequest
- 响应: CalculateResponse
- 说明: 计算 a * b 的结果

### 除法

- 端点: `/calculator.CalculatorService/Divide`
- 方法: POST
- 请求体: CalculateRequest
- 响应: CalculateResponse
- 说明: 计算 a / b 的结果
- 特殊情况: 当 b = 0 时，返回错误信息 "除数不能为零"

## 使用示例

使用 ConnectRPC 客户端调用服务：

```go
// 创建客户端
client := calculatorpb.NewCalculatorServiceClient(
    http.DefaultClient,
    "http://localhost:8080",
)

// 调用加法服务
resp, err := client.Add(context.Background(), connect.NewRequest(&calculatorpb.CalculateRequest{
    A: 10,
    B: 20,
}))

if err != nil {
    log.Fatalf("调用失败: %v", err)
}

fmt.Printf("计算结果: %f\n", resp.Msg.Result)
```

## 错误处理

服务可能返回以下错误：

- 除数为零: 当尝试执行除法操作且除数为零时
- 连接错误: 当无法连接到服务器时
- 服务器错误: 当服务器内部发生错误时

## 注意事项

- 服务支持 CORS，允许从 `http://localhost:3000` 发起的跨域请求
- 服务支持 HTTP/2 协议，提供更高效的通信
- 所有数值计算使用双精度浮点数 (double)