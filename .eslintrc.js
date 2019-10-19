module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
    browser: false,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['import', '@typescript-eslint', 'prettier', 'lodash'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier/@typescript-eslint',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  rules: {
    /**
     * Allow implicit return types for functions or function interfaces
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-function-return-type.md
     */
    '@typescript-eslint/explicit-function-return-type': 'off',
    /**
     * Enforce import order
     */
    'import/order': ['error', { groups: [['builtin', 'external', 'internal']] }],
    /** Show errors for unused variables */
    '@typescript-eslint/no-unused-vars': 'error',
    /** Show errors for un-resolved imports */
    'import/no-unresolved': 'error',
    /** Allow only method imports for lodash */
    'lodash/import-scope': ['error', 'method'],
    '@typescript-eslint/camelcase': 'off',
  },
};
