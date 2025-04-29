import { createConnectTransport } from "@connectrpc/connect-web";
import { createPromiseClient } from "@connectrpc/connect";
import { CalculatorService } from "../gen/calculator/v1/calculator_connect";

// 创建传输层
const transport = createConnectTransport({
  baseUrl: "http://localhost:8080", // 后端服务地址
});

// 创建客户端
export const calculatorClient = createPromiseClient(CalculatorService, transport); 