module.exports = {
  env: {
    es2023: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-empty-function': 'warn',
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'no-debugger': 'warn',
    'prefer-const': 'warn',
    'no-async-promise-executor': 'off',
  },
  overrides: [
    {
      files: ['**/*.ts'],
      rules: {
        'no-unused-vars': 'error',
      },
    },
  ],
};
