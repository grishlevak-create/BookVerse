/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
        },
      },
    ],
  },
  collectCoverageFrom: [
    'src/shared/**/*.{ts,tsx}',
    'src/entities/**/*.{ts,tsx}',
    'src/features/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/**/*.test.{ts,tsx}',
    '!src/pages/**',
    '!src/widgets/**',
    '!src/app/**',
  ],
  coverageThreshold: {
    global: {
      statements: 30,
      branches: 21,
      functions: 28,
      lines: 30,
    },
  },
  coverageReporters: ['text', 'text-summary', 'lcov'],
};
