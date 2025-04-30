'use client';

import React from 'react';

type ButtonType = 'digit' | 'operation' | 'function' | 'equals';

interface CalcButtonProps {
  label: string;
  type?: ButtonType;
  wide?: boolean;
  onClick: () => void;
}

/**
 * 计算器按钮组件
 */
export default function CalcButton({ 
  label, 
  type = 'digit', 
  wide = false, 
  onClick 
}: CalcButtonProps) {
  // 根据按钮类型确定样式
  const getButtonStyle = (): string => {
    switch (type) {
      case 'digit':
        return 'bg-gray-200 text-gray-800 hover:bg-gray-300';
      case 'operation':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'function':
        return 'bg-gray-300 text-gray-700 hover:bg-gray-400';
      case 'equals':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <button
      className={`calc-button ${getButtonStyle()} h-16 
      ${wide ? 'col-span-2 rounded-full pl-6 flex justify-start' : 'aspect-square'} 
      shadow-sm text-2xl font-medium focus:outline-none transition-colors duration-150`}
      onClick={onClick}
    >
      {label}
    </button>
  );
} 