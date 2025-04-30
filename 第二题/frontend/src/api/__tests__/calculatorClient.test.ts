import { testCalculateApi, createCalculateRequest } from '../calculatorClient';
import calculatorClient from '../calculatorClient';
import { CalculateRequest } from '../../gen/calculator/v1/calculator_pb.js';

// 使用正确的Operations对象引用
const { Operations } = calculatorClient;

// 模拟全局fetch
global.fetch = jest.fn();

describe('calculatorClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // 模拟fetch返回成功结果
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ result: 15, error: null }),
      status: 200,
      text: async () => ''
    });
  });

  test('testCalculateApi should call fetch with correct parameters', async () => {
    // 测试参数
    const params = {
      firstOperand: 10,
      secondOperand: 5,
      operation: Operations.ADD
    };

    // 调用函数
    await testCalculateApi(params);

    // 验证fetch是否被正确调用
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/calculator.v1.CalculatorService/Calculate',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Connect-Protocol-Version': '1'
        }),
        body: JSON.stringify({
          firstOperand: 10,
          secondOperand: 5,
          operation: Operations.ADD
        })
      })
    );
  });

  test('testCalculateApi should handle successful response', async () => {
    // 测试参数
    const params = {
      firstOperand: 10,
      secondOperand: 5,
      operation: Operations.ADD
    };

    // 调用函数
    const result = await testCalculateApi(params);

    // 验证结果
    expect(result).toEqual({ message: { result: 15, error: null } });
  });

  test('testCalculateApi should handle error response', async () => {
    // 模拟错误响应
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => 'Bad Request'
    });

    // 测试参数
    const params = {
      firstOperand: 10,
      secondOperand: 0,
      operation: Operations.DIVIDE
    };

    // 验证函数抛出错误
    await expect(testCalculateApi(params)).rejects.toThrow('API错误: 400 Bad Request');
  });

  test('createCalculateRequest should create a proper request object', () => {
    // 测试参数
    const params = {
      firstOperand: 10,
      secondOperand: 5,
      operation: Operations.MULTIPLY
    };

    // 创建请求对象
    const request = createCalculateRequest(params);

    // 验证请求对象类型和属性
    expect(request).toBeInstanceOf(CalculateRequest);
    expect(request.firstOperand).toBe(10);
    expect(request.secondOperand).toBe(5);
    expect(request.operation).toBe(Operations.MULTIPLY);
  });
}); 