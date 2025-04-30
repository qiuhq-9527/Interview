import { renderHook, act } from '@testing-library/react';
import { useCalculatorViewModel, OPERATIONS } from '../CalculatorViewModel';
import * as calculatorClient from '../../api/calculatorClient';

// 模拟 API 客户端
jest.mock('../../api/calculatorClient', () => ({
  testCalculateApi: jest.fn()
}));

describe('CalculatorViewModel', () => {
  // 每个测试前重置模拟函数
  beforeEach(() => {
    jest.clearAllMocks();
    (calculatorClient.testCalculateApi as jest.Mock).mockResolvedValue({
      message: { result: 10, error: null }
    });
  });

  test('should initialize with default state', () => {
    const { result } = renderHook(() => useCalculatorViewModel());
    
    expect(result.current.state.displayValue).toBe('0');
    expect(result.current.state.firstOperand).toBeNull();
    expect(result.current.state.operation).toBeNull();
    expect(result.current.state.waitingForSecondOperand).toBe(false);
    expect(result.current.state.result).toBeNull();
    expect(result.current.state.error).toBeNull();
  });

  test('should input digits correctly', () => {
    const { result } = renderHook(() => useCalculatorViewModel());
    
    // 输入数字 5
    act(() => {
      result.current.inputDigit('5');
    });
    
    expect(result.current.state.displayValue).toBe('5');
    
    // 继续输入数字 7
    act(() => {
      result.current.inputDigit('7');
    });
    
    expect(result.current.state.displayValue).toBe('57');
  });

  test('should clear display correctly', () => {
    const { result } = renderHook(() => useCalculatorViewModel());
    
    // 输入一些数字
    act(() => {
      result.current.inputDigit('5');
      result.current.inputDigit('7');
    });
    
    expect(result.current.state.displayValue).toBe('57');
    
    // 清除显示
    act(() => {
      result.current.clearDisplay();
    });
    
    expect(result.current.state.displayValue).toBe('0');
    expect(result.current.state.firstOperand).toBeNull();
    expect(result.current.state.operation).toBeNull();
  });

  test('should toggle sign correctly', () => {
    const { result } = renderHook(() => useCalculatorViewModel());
    
    // 输入数字
    act(() => {
      result.current.inputDigit('5');
    });
    
    expect(result.current.state.displayValue).toBe('5');
    
    // 切换符号
    act(() => {
      result.current.toggleSign();
    });
    
    expect(result.current.state.displayValue).toBe('-5');
    
    // 再次切换符号
    act(() => {
      result.current.toggleSign();
    });
    
    expect(result.current.state.displayValue).toBe('5');
  });

  test('should call API when performing equals operation', async () => {
    const { result } = renderHook(() => useCalculatorViewModel());
    
    // 设置第一个操作数和操作
    act(() => {
      result.current.inputDigit('5');
      result.current.performOperation(OPERATIONS.ADD);
    });
    
    expect(result.current.state.firstOperand).toBe(5);
    expect(result.current.state.operation).toBe(OPERATIONS.ADD);
    
    // 设置第二个操作数
    act(() => {
      result.current.inputDigit('3');
    });
    
    // 执行等号操作
    await act(async () => {
      await result.current.performEquals();
    });
    
    // 验证 API 被正确调用
    expect(calculatorClient.testCalculateApi).toHaveBeenCalledWith({
      firstOperand: 5,
      secondOperand: 3,
      operation: OPERATIONS.ADD
    });
    
    // 验证结果显示
    expect(result.current.state.displayValue).toBe('10');
  });
}); 