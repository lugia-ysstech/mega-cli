module.exports = {
  testMatch: ['**/?(*.)(spec|test|e2e).(j|t)s?(x)'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/examples/',
    '/lib/',
    '/babel-preset-mega/',
  ],
  collectCoverageFrom: ['packages/**/src/**/*.{ts,tsx,js,jsx}'],
};
