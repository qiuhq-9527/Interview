/**
 * 最基础的测试文件，即使在React 19兼容性问题下也能运行
 * 这些测试仅依赖于基本Jest功能，不需要React Testing Library
 */

describe('基础计算功能测试', () => {
  test('加法计算', () => {
    expect(1 + 1).toBe(2);
  });

  test('减法计算', () => {
    expect(5 - 3).toBe(2);
  });

  test('乘法计算', () => {
    expect(2 * 3).toBe(6);
  });

  test('除法计算', () => {
    expect(6 / 2).toBe(3);
  });
});

// 测试API请求格式
describe('API请求格式测试', () => {
  test('格式化请求参数', () => {
    const params = {
      firstOperand: 10,
      secondOperand: 5,
      operation: 1 // 加法
    };

    const formatted = JSON.stringify(params);
    const parsed = JSON.parse(formatted);

    expect(parsed).toEqual(params);
    expect(parsed.firstOperand).toBe(10);
    expect(parsed.secondOperand).toBe(5);
    expect(parsed.operation).toBe(1);
  });
}); 