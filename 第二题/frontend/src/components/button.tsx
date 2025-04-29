import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'number' | 'operator' | 'function'; // Different button styles
  className?: string; // Allow additional custom classes
  gridSpan?: number; // For buttons spanning multiple grid columns (like '0')
}

/**
 * Reusable Calculator Button Component.
 */
const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'number',
  className = '',
  gridSpan = 1,
  ...props
}) => {
  // Base styles
  let baseStyle = 
    'flex items-center justify-center rounded-full text-3xl font-medium focus:outline-none transition duration-150 ease-in-out';
  
  // Variant specific styles (inspired by iOS calculator)
  let variantStyle = '';
  switch (variant) {
    case 'operator':
      variantStyle = 'bg-orange-500 hover:bg-orange-600 text-white';
      break;
    case 'function':
      variantStyle = 'bg-gray-300 hover:bg-gray-400 text-black';
      break;
    case 'number':
    default:
      variantStyle = 'bg-gray-700 hover:bg-gray-600 text-white';
      break;
  }

  // Style for grid span
  const gridSpanStyle = gridSpan > 1 ? `col-span-${gridSpan}` : 'col-span-1';

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${gridSpanStyle} ${className}`}
      {...props}
    >
      {label}
    </button>
  );
};

export default Button; 