package main

import (
	"fmt"
	"log"
	"net/http"

	calculatorpb "calculator/backend/api/calculator"
	"calculator/backend/internal/service"

	"github.com/rs/cors"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

func main() {
	// 创建计算器服务实例
	calcService := service.NewCalculatorService()

	// 创建ConnectRPC处理器
	mux := http.NewServeMux()

	// 注册计算器服务
	path, handler := calculatorpb.NewCalculatorServiceHandler(calcService)
	mux.Handle(path, handler)

	// 配置CORS以允许前端访问
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"}, // 前端开发服务器地址
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Content-Type", "Connect-Protocol-Version"},
		AllowCredentials: true,
	})

	// 使用h2c支持HTTP/2明文连接
	addr := ":8080"
	srv := &http.Server{
		Addr:    addr,
		Handler: corsHandler.Handler(h2c.NewHandler(mux, &http2.Server{})),
	}

	fmt.Printf("计算器服务启动在 %s\n", addr)
	log.Fatal(srv.ListenAndServe())
}
