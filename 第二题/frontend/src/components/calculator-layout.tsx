import React from 'react';

interface CalculatorLayoutProps {
  children: React.ReactNode;
}

/**
 * Provides the main layout structure for the calculator UI.
 */
const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({ children }) => {
  return (
    <div className="bg-black p-4 rounded-lg shadow-xl max-w-xs mx-auto mt-10">
      {children}
    </div>
  );
};

export default CalculatorLayout; 