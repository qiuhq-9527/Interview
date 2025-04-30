'use client';

import React, { useEffect } from 'react';
import CalcButton from './CalcButton';
import CalcDisplay from './CalcDisplay';
import { useCalculatorViewModel, OPERATIONS } from '../viewmodels/CalculatorViewModel';

/**
 * 计算器主组件，组合所有UI元素和处理交互
 */
export default function Calculator() {
  const {
    state,
    inputDigit,
    inputDecimal,
    clearDisplay,
    toggleSign,
    inputPercent,
    performOperation,
    performEquals,
  } = useCalculatorViewModel();

  // 添加调试函数
  const handleOperation = (operation: number) => {
    console.log('按下操作按钮:', operation);
    performOperation(operation);
  };

  const handleEquals = () => {
    console.log('按下等号按钮');
    performEquals();
  };

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 数字按键 0-9
      if (/^\d$/.test(e.key)) {
        console.log('键盘输入数字:', e.key);
        inputDigit(e.key);
      }
      // 小数点
      else if (e.key === '.') {
        console.log('键盘输入小数点');
        inputDecimal();
      }
      // 回车键(等于)
      else if (e.key === 'Enter') {
        console.log('键盘输入回车(等于)');
        performEquals();
      }
      // 操作符
      else if (e.key === '+') {
        console.log('键盘输入加号');
        performOperation(OPERATIONS.ADD);
      }
      else if (e.key === '-') {
        console.log('键盘输入减号');
        performOperation(OPERATIONS.SUBTRACT);
      }
      else if (e.key === '*' || e.key === 'x') {
        console.log('键盘输入乘号');
        performOperation(OPERATIONS.MULTIPLY);
      }
      else if (e.key === '/') {
        console.log('键盘输入除号');
        performOperation(OPERATIONS.DIVIDE);
      }
      // 清除(ESC, Delete)
      else if (e.key === 'Escape' || e.key === 'Delete') {
        console.log('键盘输入清除');
        clearDisplay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputDigit, inputDecimal, performEquals, performOperation, clearDisplay]);

  // 显示当前状态用于调试
  console.log('Calculator 状态:', state);

  return (
    <div className="calculator  w-full max-w-md p-4 ">
      {/* 显示屏 */}
      <CalcDisplay 
        value={state.displayValue} 
        hasError={!!state.error} 
        pendingOperation={state.operation ? true : false}
        firstOperand={state.firstOperand ? String(state.firstOperand) : null}
        operationType={state.operation ? getOperationSymbol(state.operation) : null}
      />
      
      {/* 按键面板 */}
      <div className="grid grid-cols-4 gap-3 mt-4">
        {/* 第一行: 清除(AC)、正负号(±)、百分号(%)、除法(÷) */}
        <CalcButton type="function" label="AC" onClick={clearDisplay} />
        <CalcButton type="function" label="±" onClick={toggleSign} />
        <CalcButton type="function" label="%" onClick={inputPercent} />
        <CalcButton 
          type="operation" 
          label="÷" 
          onClick={() => handleOperation(OPERATIONS.DIVIDE)} 
        />
        
        {/* 第二行: 7, 8, 9, 乘法(×) */}
        <CalcButton label="7" onClick={() => inputDigit("7")} />
        <CalcButton label="8" onClick={() => inputDigit("8")} />
        <CalcButton label="9" onClick={() => inputDigit("9")} />
        <CalcButton 
          type="operation" 
          label="×" 
          onClick={() => handleOperation(OPERATIONS.MULTIPLY)} 
        />
        
        {/* 第三行: 4, 5, 6, 减法(-) */}
        <CalcButton label="4" onClick={() => inputDigit("4")} />
        <CalcButton label="5" onClick={() => inputDigit("5")} />
        <CalcButton label="6" onClick={() => inputDigit("6")} />
        <CalcButton 
          type="operation" 
          label="-" 
          onClick={() => handleOperation(OPERATIONS.SUBTRACT)} 
        />
        
        {/* 第四行: 1, 2, 3, 加法(+) */}
        <CalcButton label="1" onClick={() => inputDigit("1")} />
        <CalcButton label="2" onClick={() => inputDigit("2")} />
        <CalcButton label="3" onClick={() => inputDigit("3")} />
        <CalcButton 
          type="operation" 
          label="+" 
          onClick={() => handleOperation(OPERATIONS.ADD)} 
        />
        
        {/* 第五行: 0, 小数点(.), 等号(=) */}
        <CalcButton label="0" wide onClick={() => inputDigit("0")} />
        <CalcButton label="." onClick={inputDecimal} />
        <CalcButton type="equals" label="=" onClick={handleEquals} />
      </div>
    </div>
  );
}

// 辅助函数：获取操作符符号
function getOperationSymbol(operation: number): string {
  switch (operation) {
    case OPERATIONS.ADD:
      return '+';
    case OPERATIONS.SUBTRACT:
      return '-';
    case OPERATIONS.MULTIPLY:
      return '×';
    case OPERATIONS.DIVIDE:
      return '÷';
    default:
      return '';
  }
} 