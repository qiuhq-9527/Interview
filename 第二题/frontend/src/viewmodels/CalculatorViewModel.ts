import { useState } from "react";
import { CalculatorState, initialCalculatorState } from "../models/CalculatorModel";
import { testCalculateApi } from "../api/calculatorClient";

// 定义操作符常量
export const OPERATIONS = {
  UNSPECIFIED: 0,
  ADD: 1,
  SUBTRACT: 2,
  MULTIPLY: 3,
  DIVIDE: 4
};

// 验证操作请求格式
function validateOperationRequest(params: any) {
  const { firstOperand, secondOperand, operation } = params;
  
  if (typeof firstOperand !== 'number') {
    console.error('非法的第一操作数类型:', typeof firstOperand, firstOperand);
    return false;
  }
  
  if (typeof secondOperand !== 'number') {
    console.error('非法的第二操作数类型:', typeof secondOperand, secondOperand);
    return false;
  }
  
  if (![1, 2, 3, 4].includes(operation)) {
    console.error('非法的操作类型:', operation);
    return false;
  }
  
  return true;
}

/**
 * 计算器视图模型，处理计算器的业务逻辑
 */
export function useCalculatorViewModel() {
  const [state, setState] = useState<CalculatorState>(initialCalculatorState);

  /**
   * 输入数字
   * @param digit 输入的数字 (0-9)
   */
  const inputDigit = (digit: string) => {
    if (state.waitingForSecondOperand) {
      setState({
        ...state,
        displayValue: digit,
        waitingForSecondOperand: false,
      });
    } else {
      // 当前显示的值为"0"或有错误时，替换数字，否则追加数字
      setState({
        ...state,
        displayValue: state.displayValue === "0" || state.error 
          ? digit 
          : state.displayValue + digit,
        error: null,
      });
    }
  };

  /**
   * 输入小数点
   */
  const inputDecimal = () => {
    // 如果正在等待输入第二个操作数，重置为"0."
    if (state.waitingForSecondOperand) {
      setState({
        ...state,
        displayValue: "0.",
        waitingForSecondOperand: false,
      });
      return;
    }

    // 如果当前显示值没有小数点，则添加一个小数点
    if (!state.displayValue.includes(".")) {
      setState({
        ...state,
        displayValue: state.displayValue + ".",
      });
    }
  };

  /**
   * 清除显示屏，重置计算器状态
   */
  const clearDisplay = () => {
    setState(initialCalculatorState);
  };

  /**
   * 切换正负号
   */
  const toggleSign = () => {
    setState({
      ...state,
      displayValue: String(-parseFloat(state.displayValue)),
    });
  };

  /**
   * 输入百分号，将当前值转换为百分比
   */
  const inputPercent = () => {
    const value = parseFloat(state.displayValue) / 100;
    setState({
      ...state,
      displayValue: String(value),
    });
  };

  /**
   * 执行二元操作（加、减、乘、除）
   * @param nextOperation 要执行的操作
   */
  const performOperation = async (nextOperation: number) => {
    // 当前显示值转换为数字
    const inputValue = parseFloat(state.displayValue);

    console.log('执行操作:', { firstOperand: state.firstOperand, operation: state.operation, nextOperation, inputValue });

    // 如果已经有第一个操作数和操作符，执行计算
    if (state.firstOperand !== null && state.operation !== null && !state.waitingForSecondOperand) {
      try {
        const params = {
          firstOperand: state.firstOperand,
          secondOperand: inputValue,
          operation: state.operation,
        };
        
        console.log('API调用参数:', params);
        
        // 验证请求参数
        if (!validateOperationRequest(params)) {
          throw new Error('API参数验证失败');
        }

        // 直接使用testCalculateApi
        console.log('使用testCalculateApi发送请求');
        const result = await testCalculateApi(params);
        console.log('API响应:', result);
        
        const response = result.message;

        // 更新状态
        if (response.error) {
          console.error('API返回错误:', response.error);
          setState({
            ...state,
            displayValue: "Error",
            error: response.error,
            firstOperand: null,
            operation: null,
            waitingForSecondOperand: false,
          });
        } else {
          console.log('API计算结果:', response.result);
          // 将结果设置为第一个操作数，等待下一个操作
          setState({
            ...state,
            displayValue: "0", // 重置显示值，等待输入第二个操作数
            firstOperand: response.result,
            operation: nextOperation,
            waitingForSecondOperand: true,
            result: response.result,
            error: null,
          });
        }
      } catch (error) {
        // 处理API调用错误
        console.error('API调用异常:', error);
        setState({
          ...state,
          displayValue: "Error",
          error: "计算出错，请重试",
          waitingForSecondOperand: false,
        });
      }
    } else {
      // 保存第一个操作数和操作符，等待输入第二个操作数
      console.log('保存第一个操作数:', { firstOperand: inputValue, operation: nextOperation });
      setState({
        ...state,
        firstOperand: inputValue,
        operation: nextOperation,
        waitingForSecondOperand: true,
        displayValue: "0", // 重置显示值，等待输入第二个操作数
        error: null,
      });
    }
  };

  /**
   * 执行等号操作，计算结果
   */
  const performEquals = async () => {
    // 当前显示值转换为数字，作为第二个操作数
    const secondOperand = parseFloat(state.displayValue);
    
    console.log('执行等号操作:', { firstOperand: state.firstOperand, secondOperand, operation: state.operation });

    // 需要有第一个操作数和操作符才能执行计算
    if (state.firstOperand !== null && state.operation !== null) {
      try {
        const params = {
          firstOperand: state.firstOperand,
          secondOperand: secondOperand,
          operation: state.operation
        };
        
        console.log('等号API调用参数:', params);
        
        // 验证请求参数
        if (!validateOperationRequest(params)) {
          throw new Error('等号API参数验证失败');
        }

        // 直接使用testCalculateApi
        console.log('等号使用testCalculateApi发送请求');
        const result = await testCalculateApi(params);
        console.log('等号API响应:', result);
        
        const response = result.message;

        // 更新状态
        if (response.error) {
          console.error('等号API返回错误:', response.error);
          setState({
            ...state,
            displayValue: "Error",
            error: response.error,
            firstOperand: null,
            operation: null,
            waitingForSecondOperand: false,
          });
        } else {
          console.log('等号API计算结果:', response.result);
          // 显示结果，并重置计算器状态,但保留当前结果作为下一次计算的第一个操作数
          setState({
            ...state,
            displayValue: String(response.result),
            firstOperand: null,
            operation: null,
            waitingForSecondOperand: false,
            result: response.result,
            error: null,
          });
        }
      } catch (error) {
        // 处理API调用错误
        console.error('等号API调用异常:', error);
        setState({
          ...state,
          displayValue: "Error",
          error: "计算出错，请重试",
          waitingForSecondOperand: false,
        });
      }
    }
  };

  return {
    state,
    inputDigit,
    inputDecimal,
    clearDisplay,
    toggleSign,
    inputPercent,
    performOperation,
    performEquals,
  };
} 