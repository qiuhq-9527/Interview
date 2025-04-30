import { createConnectTransport } from "@connectrpc/connect-web";
import { createPromiseClient, Interceptor } from "@connectrpc/connect";
import { CalculatorService } from "../gen/calculator/v1/calculator_connect";
import { CalculateRequest, Operation } from "../gen/calculator/v1/calculator_pb.js";

// 调试函数: 拦截并记录请求
const logInterceptor: Interceptor = (next) => async (req) => {
  console.log('[API请求]', {
    service: req.service,
    method: req.method,
    url: req.url,
    message: req.message,
    headers: req.header
  });
  try {
    const res = await next(req);
    console.log('[API响应]', res);
    return res;
  } catch (err) {
    console.error('[API错误]', err);
    throw err;
  }
};

// 创建传输层
const transport = createConnectTransport({
  baseUrl: "http://localhost:8080", // 后端服务地址
  useBinaryFormat: false, // 使用JSON格式而非二进制，更兼容
  interceptors: [logInterceptor], // 添加拦截器
  jsonOptions: {
    emitDefaultValues: true, // 输出默认值字段
  },
});

// 操作符枚举
const Operations = {
  ADD: 1,
  SUBTRACT: 2,
  MULTIPLY: 3,
  DIVIDE: 4
};

// 测试API客户端：直接使用Fetch调用
export async function testCalculateApi(params: any) {
  try {
    console.log('[API] 开始调用计算器API...');
    
    // 构建请求
    const request = {
      firstOperand: params.firstOperand,
      secondOperand: params.secondOperand,
      operation: params.operation
    };
    
    // 打印请求体
    console.log('[API] 请求体:', JSON.stringify(request));
    
    // 修正请求格式，符合ConnectRPC规范
    const response = await fetch('http://localhost:8080/calculator.v1.CalculatorService/Calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Connect-Protocol-Version': '1'
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] 错误状态码:', response.status, errorText);
      throw new Error(`API错误: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('[API] 响应:', response.status, data);
    
    return { message: data };
  } catch (error) {
    console.error('[API] 错误:', error);
    throw error;
  }
}

// 测试连接
export async function testConnection() {
  try {
    console.log('[API] 测试连接...');
    const response = await fetch('http://localhost:8080', { 
      method: 'GET'
    });
    console.log('[API] 连接状态:', response.status, response.statusText);
    return response.status;
  } catch (error) {
    console.error('[API] 连接失败:', error);
    throw error;
  }
}

// 创建客户端
export const calculatorClient = createPromiseClient(CalculatorService, transport);

// 适配器函数：将普通对象转换为正确的CalculateRequest对象
export function createCalculateRequest(params: any): any {
  // 使用我们自定义的CalculateRequest类
  const request = new CalculateRequest({
    firstOperand: params.firstOperand,
    secondOperand: params.secondOperand,
    operation: params.operation
  });
  console.log('[创建请求] 请求对象:', request);
  return request;
}

// 增强客户端：添加类型转换
export const enhancedCalculatorClient = {
  calculate: async (params: any) => {
    const request = createCalculateRequest(params);
    return await calculatorClient.calculate(request);
  }
};

// 提供默认导出
export default {
  calculate: testCalculateApi,
  testConnection,
  Operations
}; 