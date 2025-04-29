import { useState } from "react";
import { CalculatorState, initialCalculatorState } from "../models/CalculatorModel";
import { Operation } from "../gen/calculator/v1/calculator_pb";
import { calculatorClient } from "../api/calculatorClient";

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
  const performOperation = async (nextOperation: Operation) => {
    // 当前显示值转换为数字
    const inputValue = parseFloat(state.displayValue);

    // 如果已经有第一个操作数和操作符，执行计算
    if (state.firstOperand !== null && state.operation !== null && !state.waitingForSecondOperand) {
      try {
        // 调用后端API执行计算
        const response = await calculatorClient.calculate({
          firstOperand: state.firstOperand,
          secondOperand: inputValue,
          operation: state.operation,
        });

        // 更新状态
        if (response.error) {
          setState({
            ...state,
            displayValue: "Error",
            error: response.error,
            firstOperand: null,
            operation: null,
            waitingForSecondOperand: false,
          });
        } else {
          // 将结果设置为第一个操作数，等待下一个操作
          setState({
            ...state,
            displayValue: String(response.result),
            firstOperand: response.result,
            operation: nextOperation,
            waitingForSecondOperand: true,
            result: response.result,
            error: null,
          });
        }
      } catch (error) {
        // 处理API调用错误
        setState({
          ...state,
          displayValue: "Error",
          error: "计算出错，请重试",
          waitingForSecondOperand: false,
        });
      }
    } else {
      // 保存第一个操作数和操作符，等待输入第二个操作数
      setState({
        ...state,
        firstOperand: inputValue,
        operation: nextOperation,
        waitingForSecondOperand: true,
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

    // 需要有第一个操作数和操作符才能执行计算
    if (state.firstOperand !== null && state.operation !== null) {
      try {
        // 调用后端API执行计算
        const response = await calculatorClient.calculate({
          firstOperand: state.firstOperand,
          secondOperand: secondOperand,
          operation: state.operation,
        });

        // 更新状态
        if (response.error) {
          setState({
            ...state,
            displayValue: "Error",
            error: response.error,
            firstOperand: null,
            operation: null,
            waitingForSecondOperand: false,
          });
        } else {
          // 显示结果，并重置计算器状态
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