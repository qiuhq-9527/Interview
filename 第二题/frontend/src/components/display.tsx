import React from 'react';

interface DisplayProps {
  value: string;
  error?: string | null; // Optional error message to display
}

/**
 * Calculator Display Component.
 * Shows the current input/result or an error message.
 */
const Display: React.FC<DisplayProps> = ({ value, error }) => {
  // Determine the text size based on the length of the value
  // This is a basic implementation, might need refinement for perfect fit
  const textSizeClass = value.length > 9 ? 'text-4xl' : value.length > 6 ? 'text-5xl' : 'text-6xl';

  return (
    <div className="bg-black text-white w-full py-4 px-6 mb-1 rounded-md text-right overflow-hidden">
      {error ? (
        <div className="text-red-500 text-xl truncate" title={error}>Error: {error}</div>
      ) : (
        <div className={`font-light ${textSizeClass} truncate`} title={value}>
          {value}
        </div>
      )}
    </div>
  );
};

export default Display; 