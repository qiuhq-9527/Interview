import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Calculator from '../Calculator';
import { useCalculatorViewModel } from '../../viewmodels/CalculatorViewModel';

// 模拟ViewModel
jest.mock('../../viewmodels/CalculatorViewModel', () => ({
  useCalculatorViewModel: jest.fn(),
  OPERATIONS: {
    ADD: 1,
    SUBTRACT: 2,
    MULTIPLY: 3,
    DIVIDE: 4
  }
}));

describe('Calculator', () => {
  // 模拟ViewModel的返回值
  const mockInputDigit = jest.fn();
  const mockInputDecimal = jest.fn();
  const mockClearDisplay = jest.fn();
  const mockToggleSign = jest.fn();
  const mockInputPercent = jest.fn();
  const mockPerformOperation = jest.fn();
  const mockPerformEquals = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useCalculatorViewModel as jest.Mock).mockReturnValue({
      state: {
        displayValue: "42",
        firstOperand: 10,
        operation: 1,
        waitingForSecondOperand: false,
        result: null,
        error: null
      },
      inputDigit: mockInputDigit,
      inputDecimal: mockInputDecimal,
      clearDisplay: mockClearDisplay,
      toggleSign: mockToggleSign,
      inputPercent: mockInputPercent,
      performOperation: mockPerformOperation,
      performEquals: mockPerformEquals
    });
  });

  test('renders calculator with correct display value', () => {
    render(<Calculator />);
    
    // 找到显示值元素并验证其内容
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  test('clicking digit buttons calls inputDigit', () => {
    render(<Calculator />);
    
    // 点击数字按钮
    fireEvent.click(screen.getByText("5"));
    
    // 验证是否调用了正确的函数
    expect(mockInputDigit).toHaveBeenCalledWith("5");
  });

  test('clicking clear button calls clearDisplay', () => {
    render(<Calculator />);
    
    // 点击清除按钮
    fireEvent.click(screen.getByText("AC"));
    
    // 验证是否调用了正确的函数
    expect(mockClearDisplay).toHaveBeenCalled();
  });

  test('clicking equals button calls performEquals', () => {
    render(<Calculator />);
    
    // 点击等号按钮
    fireEvent.click(screen.getByText("="));
    
    // 验证是否调用了正确的函数
    expect(mockPerformEquals).toHaveBeenCalled();
  });

  test('clicking operation button calls performOperation', () => {
    render(<Calculator />);
    
    // 点击加号按钮
    fireEvent.click(screen.getByText("+"));
    
    // 验证是否调用了正确的函数，并传入了正确的操作类型
    expect(mockPerformOperation).toHaveBeenCalledWith(1);
  });

  test('keyboard events trigger correct actions', () => {
    render(<Calculator />);
    
    // 模拟键盘事件
    fireEvent.keyDown(window, { key: '5' });
    expect(mockInputDigit).toHaveBeenCalledWith('5');
    
    fireEvent.keyDown(window, { key: '+' });
    expect(mockPerformOperation).toHaveBeenCalledWith(1);
    
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(mockPerformEquals).toHaveBeenCalled();
    
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(mockClearDisplay).toHaveBeenCalled();
  });
}); 