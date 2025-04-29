'use client';

import React from 'react';

interface CalcDisplayProps {
  value: string;
  hasError?: boolean;
}

/**
 * 计算器显示屏组件
 */
export default function CalcDisplay({ value, hasError = false }: CalcDisplayProps) {
  // 格式化显示值，处理大数和长数字
  const formatDisplayValue = (value: string): string => {
    // 错误信息直接显示
    if (value === 'Error' || hasError) {
      return 'Error';
    }

    // 尝试解析数字
    const num = parseFloat(value);
    
    // 处理特殊情况
    if (isNaN(num)) return '0';
    if (!isFinite(num)) return 'Error';
    
    // 将数字转换为字符串，使用指数表示法处理大数
    if (Math.abs(num) >= 1e10 || (Math.abs(num) < 1e-6 && num !== 0)) {
      return num.toExponential(6);
    }
    
    // 正常数字，限制长度
    const formatted = String(num);
    if (formatted.length > 10) {
      // 如果太长，截断并保留一定精度
      if (formatted.includes('.')) {
        return num.toFixed(9 - formatted.split('.')[0].length);
      } else {
        return num.toPrecision(9);
      }
    }
    
    return formatted;
  };

  // 根据数字长度调整字体大小
  const getFontSize = (value: string): string => {
    const length = value.length;
    if (length > 8) return 'text-3xl';
    if (length > 6) return 'text-4xl';
    return 'text-5xl';
  };

  const displayValue = formatDisplayValue(value);

  return (
    <div className="w-full h-24 flex items-end justify-end px-4 pb-2 overflow-hidden">
      <span className={`${getFontSize(displayValue)} font-semibold ${hasError ? 'text-red-500' : 'text-white'}`}>
        {displayValue}
      </span>
    </div>
  );
} 