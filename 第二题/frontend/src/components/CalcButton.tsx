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
        return 'bg-calc-gray text-white';
      case 'operation':
        return 'bg-calc-orange text-white';
      case 'function':
        return 'bg-calc-light-gray text-black';
      case 'equals':
        return 'bg-calc-orange text-white';
      default:
        return 'bg-calc-gray text-white';
    }
  };

  return (
    <button
      className={`calc-button ${getButtonStyle()} h-16 
      ${wide ? 'col-span-2 rounded-full pl-6 flex justify-start' : 'aspect-square'} 
      shadow-calc-button text-2xl font-medium focus:outline-none`}
      onClick={onClick}
    >
      {label}
    </button>
  );
} 