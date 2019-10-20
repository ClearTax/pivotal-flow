module.exports = {
  preset: 'ts-jest',
  displayName: {
    name: 'pivotal-flow',
    color: 'blue',
  },
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/node_modules/**', '!**/dist/**', '!**/*.d.ts'],
  coverageDirectory: 'coverage',
  modulePathIgnorePatterns: ['/dist/'],
  testEnvironment: 'node',
};
