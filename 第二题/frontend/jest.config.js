const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // 指定Next.js应用的根目录，用于加载next.config.js和.env文件
  dir: './',
});

// Jest自定义配置
const customJestConfig = {
  // 添加更多的测试环境设置
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // 处理模块别名
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  transform: {
    // 使用ts-jest处理TypeScript文件
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: './tsconfig.json' }],
  },
  // 指定测试覆盖率的配置
  coveragePathIgnorePatterns: ['/node_modules/', '/.next/'],
  // 添加React 19兼容性设置
  moduleNameMapper: {
    '^react($|/.+)': '<rootDir>/node_modules/react$1',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@testing-library)'
  ]
};

// createJestConfig会将next/jest提供的默认配置和自定义配置合并
module.exports = createJestConfig(customJestConfig); 