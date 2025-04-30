// 导入jest-dom扩展，添加DOM相关的匹配器
import '@testing-library/jest-dom';

// 模拟window.fetch
global.fetch = jest.fn();

// 模拟console方法
global.console = {
  ...console,
  // 保持console.log/error等方法在测试时静默
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// React 19兼容性设置
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    // 模拟可能在新版本中不兼容的方法
    useLayoutEffect: originalReact.useEffect,
  };
}); 