/** Jest configuration for Attendo (unit + component tests).
 *
 * Uses the jest-expo preset (Babel transform via babel.config.js, Expo module
 * mocks). React Native Testing Library v14 + test-renderer provide the render
 * pipeline. Maestro handles E2E (see tests/e2e) and is not run by Jest.
 *
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  preset: 'jest-expo',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  moduleNameMapper: {
    '^@/assets/(.*)$': '<rootDir>/assets/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  clearMocks: true,
};
