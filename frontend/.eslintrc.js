/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  extends: ['next/core-web-vitals', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: { 'prettier/prettier': 'error' },
};
