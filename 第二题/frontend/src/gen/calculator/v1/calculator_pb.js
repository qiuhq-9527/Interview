// 直接定义Operation枚举
export const Operation = {
  UNSPECIFIED: 0,
  ADD: 1,
  SUBTRACT: 2,
  MULTIPLY: 3,
  DIVIDE: 4
};

// 简单的请求对象
export class CalculateRequest {
  constructor(data) {
    this.firstOperand = data?.firstOperand || 0;
    this.secondOperand = data?.secondOperand || 0;
    this.operation = data?.operation || Operation.UNSPECIFIED;
  }
}

// 简单的响应对象
export class CalculateResponse {
  constructor(data) {
    this.result = data?.result || 0;
    this.error = data?.error || "";
  }
} 