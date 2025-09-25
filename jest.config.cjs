module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/src/**/_tests_/**/*.(spec|test).ts',
    '<rootDir>/src/**/_tests_/**/*.(spec|test).js',
  ],
  moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: '/tsconfig.jest.json',
      babelConfig: true,
    },
  },

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}
