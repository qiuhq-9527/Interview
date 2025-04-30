import { initialCalculatorState } from '../CalculatorModel';
import '@testing-library/jest-dom';

describe('CalculatorModel', () => {
  test('initialCalculatorState should have correct default values', () => {
    // 测试初始状态是否正确
    expect(initialCalculatorState.displayValue).toBe("0");
    expect(initialCalculatorState.firstOperand).toBeNull();
    expect(initialCalculatorState.operation).toBeNull();
    expect(initialCalculatorState.waitingForSecondOperand).toBe(false);
    expect(initialCalculatorState.result).toBeNull();
    expect(initialCalculatorState.error).toBeNull();
  });
}); 