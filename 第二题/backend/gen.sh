#!/bin/bash

# 安装必要的工具
go install github.com/bufbuild/buf/cmd/buf@latest
go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latest
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install github.com/bufbuild/connect-go/cmd/protoc-gen-connect-go@latest

# 创建生成目录
mkdir -p api/calculator/gen

# 生成代码
protoc --go_out=. --connect-go_out=. api/calculator/calculator.proto

echo "ConnectRPC代码生成完成"