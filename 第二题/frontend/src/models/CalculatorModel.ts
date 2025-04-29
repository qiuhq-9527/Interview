import { Operation } from "../gen/calculator/v1/calculator_pb";

/**
 * 计算器模型，负责存储计算器的状态
 */
export interface CalculatorState {
  // 显示屏上显示的当前值
  displayValue: string;
  
  // 第一个操作数
  firstOperand: number | null;
  
  // 操作类型
  operation: Operation | null;
  
  // 是否等待输入第二个操作数
  waitingForSecondOperand: boolean;
  
  // 操作结果
  result: number | null;
  
  // 错误信息
  error: string | null;
}

/**
 * 计算器模型的初始状态
 */
export const initialCalculatorState: CalculatorState = {
  displayValue: "0",
  firstOperand: null,
  operation: null,
  waitingForSecondOperand: false,
  result: null,
  error: null,
}; 