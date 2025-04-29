'use client';

import React, { useEffect } from 'react';
import CalcButton from './CalcButton';
import CalcDisplay from './CalcDisplay';
import { useCalculatorViewModel } from '../viewmodels/CalculatorViewModel';
import { Operation } from '../gen/calculator/v1/calculator_pb';

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

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 数字按键 0-9
      if (/^\d$/.test(e.key)) {
        inputDigit(e.key);
      }
      // 小数点
      else if (e.key === '.') {
        inputDecimal();
      }
      // 回车键(等于)
      else if (e.key === 'Enter') {
        performEquals();
      }
      // 操作符
      else if (e.key === '+') {
        performOperation(Operation.ADD);
      }
      else if (e.key === '-') {
        performOperation(Operation.SUBTRACT);
      }
      else if (e.key === '*' || e.key === 'x') {
        performOperation(Operation.MULTIPLY);
      }
      else if (e.key === '/') {
        performOperation(Operation.DIVIDE);
      }
      // 清除(ESC, Delete)
      else if (e.key === 'Escape' || e.key === 'Delete') {
        clearDisplay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputDigit, inputDecimal, performEquals, performOperation, clearDisplay]);

  return (
    <div className="calculator bg-calc-dark rounded-2xl w-72 p-4 shadow-xl">
      {/* 显示屏 */}
      <CalcDisplay value={state.displayValue} hasError={!!state.error} />
      
      {/* 按键面板 */}
      <div className="grid grid-cols-4 gap-3 mt-4">
        {/* 第一行: 清除(AC)、正负号(±)、百分号(%)、除法(÷) */}
        <CalcButton type="function" label="AC" onClick={clearDisplay} />
        <CalcButton type="function" label="±" onClick={toggleSign} />
        <CalcButton type="function" label="%" onClick={inputPercent} />
        <CalcButton 
          type="operation" 
          label="÷" 
          onClick={() => performOperation(Operation.DIVIDE)} 
        />
        
        {/* 第二行: 7, 8, 9, 乘法(×) */}
        <CalcButton label="7" onClick={() => inputDigit("7")} />
        <CalcButton label="8" onClick={() => inputDigit("8")} />
        <CalcButton label="9" onClick={() => inputDigit("9")} />
        <CalcButton 
          type="operation" 
          label="×" 
          onClick={() => performOperation(Operation.MULTIPLY)} 
        />
        
        {/* 第三行: 4, 5, 6, 减法(-) */}
        <CalcButton label="4" onClick={() => inputDigit("4")} />
        <CalcButton label="5" onClick={() => inputDigit("5")} />
        <CalcButton label="6" onClick={() => inputDigit("6")} />
        <CalcButton 
          type="operation" 
          label="-" 
          onClick={() => performOperation(Operation.SUBTRACT)} 
        />
        
        {/* 第四行: 1, 2, 3, 加法(+) */}
        <CalcButton label="1" onClick={() => inputDigit("1")} />
        <CalcButton label="2" onClick={() => inputDigit("2")} />
        <CalcButton label="3" onClick={() => inputDigit("3")} />
        <CalcButton 
          type="operation" 
          label="+" 
          onClick={() => performOperation(Operation.ADD)} 
        />
        
        {/* 第五行: 0, 小数点(.), 等号(=) */}
        <CalcButton label="0" wide onClick={() => inputDigit("0")} />
        <CalcButton label="." onClick={inputDecimal} />
        <CalcButton type="equals" label="=" onClick={performEquals} />
      </div>
    </div>
  );
} 