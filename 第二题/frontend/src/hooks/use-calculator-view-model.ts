import { useState, useCallback } from 'react';
import { createPromiseClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';
import { CalculatorService } from '@/gen/calculator/v1/calculator_connect';
import { Operation } from '@/gen/calculator/v1/calculator_pb';

// Define the state structure for the calculator
interface CalculatorState {
  displayValue: string; // Value shown on the display
  currentValue: number | null; // The first operand or intermediate result
  operator: Operation | null; // The selected operation
  waitingForOperand: boolean; // Flag to indicate if the next input should start a new number
  error: string | null; // Error message from backend or calculation
}

// Initial state of the calculator
const initialState: CalculatorState = {
  displayValue: '0',
  currentValue: null,
  operator: null,
  waitingForOperand: false,
  error: null,
};

// Backend service URL
const transport = createConnectTransport({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080',
});

// Create the ConnectRPC client
const client = createPromiseClient(CalculatorService, transport);

/**
 * Custom hook for calculator logic and state management (ViewModel).
 * @returns An object containing calculator state and action handlers.
 */
export const useCalculatorViewModel = () => {
  const [state, setState] = useState<CalculatorState>(initialState);

  // --- Input Handlers --- 

  /**
   * Handles number button clicks.
   * @param {string} digit - The digit pressed.
   */
  const handleDigitClick = useCallback((digit: string) => {
    setState(prevState => {
      // Clear error on new input
      const newState = { ...prevState, error: null }; 

      if (newState.waitingForOperand) {
        // Start new operand
        return { ...newState, displayValue: digit, waitingForOperand: false };
      } else {
        // Append digit or replace '0'
        const newDisplayValue = newState.displayValue === '0' ? digit : newState.displayValue + digit;
        // TODO: Add check for display value length limit?
        return { ...newState, displayValue: newDisplayValue };
      }
    });
  }, []);

  /**
   * Handles decimal point button click.
   */
  const handleDecimalClick = useCallback(() => {
    setState(prevState => {
      if (prevState.waitingForOperand) {
         // Start new number with '0.'
        return { ...prevState, displayValue: '0.', waitingForOperand: false, error: null };
      }
      if (!prevState.displayValue.includes('.')) {
        return { ...prevState, displayValue: prevState.displayValue + '.', error: null };
      }
      return prevState; // Already has a decimal
    });
  }, []);

  /**
   * Handles operator button clicks (+, -, ×, ÷).
   * @param {Operation} op - The operation enum value.
   */
  const handleOperatorClick = useCallback((op: Operation) => {
    setState(prevState => {
      const inputValue = parseFloat(prevState.displayValue);

      if (prevState.currentValue === null) {
        // First operation in a sequence
        return {
          ...prevState,
          currentValue: inputValue,
          operator: op,
          waitingForOperand: true,
          error: null,
        };
      } else {
        // Chaining operations (e.g., 5 + 3 - 2)
        // We need to calculate the intermediate result here *before* setting the new operator
        // TODO: Implement intermediate calculation or decide on behavior (e.g., calculate on next operator)
        // For now, just store the new operator and wait for '=' 
        return {
          ...prevState,
          currentValue: inputValue, // Or should this be the result of previous op?
          operator: op,
          waitingForOperand: true,
          error: null,
        };
      }
    });
  }, []);

  /**
   * Handles the equals (=) button click.
   */
  const handleEqualsClick = useCallback(async () => {
    setState(prevState => {
      if (prevState.operator === null || prevState.currentValue === null) {
        // Nothing to calculate
        return prevState;
      }

      const firstOperand = prevState.currentValue;
      const secondOperand = parseFloat(prevState.displayValue);
      const operation = prevState.operator;

      // Optimistically set state while waiting for backend
      // setState(p => ({ ...p, waitingForOperand: true })); // Maybe show loading?

      // Call backend
      client.calculate({ 
          firstOperand, 
          secondOperand, 
          operation 
        })
        .then(response => {
          if (response.error) {
            setState(prev => ({ 
              ...initialState, // Reset state on backend error?
              displayValue: 'Error', 
              error: response.error 
            }));
          } else {
            setState(prev => ({
              ...initialState, // Reset after calculation
              displayValue: String(response.result), // Display the result
              currentValue: response.result, // Store result for potential chaining
            }));
          }
        })
        .catch(error => {
           console.error("Calculation Error:", error);
           setState(prev => ({ 
              ...initialState, // Reset state on connect error
              displayValue: 'Error', 
              error: 'Calculation failed' 
            }));
        });
        
      // Since the API call is async, we return the current state before the promise resolves.
      // The state will be updated in the .then() or .catch() blocks.
      // We set waitingForOperand here so the next digit starts a new number.
      return { ...prevState, waitingForOperand: true }; 
    });
  }, []);

  /**
   * Handles the All Clear (AC) button click.
   */
  const handleClearClick = useCallback(() => {
    setState(initialState);
  }, []);

  /**
   * Handles the plus/minus (+/-) button click.
   */
  const handleToggleSignClick = useCallback(() => {
    setState(prevState => {
      const currentValue = parseFloat(prevState.displayValue);
      if (currentValue === 0) return prevState; // Don't toggle sign for zero
      return { ...prevState, displayValue: String(currentValue * -1) };
    });
  }, []);

  /**
   * Handles the percentage (%) button click.
   */
  const handlePercentClick = useCallback(() => {
    setState(prevState => {
      const currentValue = parseFloat(prevState.displayValue);
      return { ...prevState, displayValue: String(currentValue / 100) };
    });
  }, []);

  return {
    state,
    handleDigitClick,
    handleDecimalClick,
    handleOperatorClick,
    handleEqualsClick,
    handleClearClick,
    handleToggleSignClick,
    handlePercentClick,
  };
}; 