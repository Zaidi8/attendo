const expoConfig = require('eslint-config-expo/flat');
const eslintConfigPrettier = require('eslint-config-prettier/flat');

// Flat ESLint config (ESLint 9). eslint-config-expo/flat is an array of config
// objects, so it is spread in. eslint-config-prettier is applied last to switch
// off stylistic rules that would fight Prettier.
// See https://docs.expo.dev/guides/using-eslint/
module.exports = [
  ...expoConfig,
  eslintConfigPrettier,
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*', 'ios/*', 'android/*', 'coverage/*'],
  },
];
