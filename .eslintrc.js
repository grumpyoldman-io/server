module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'standard-with-typescript',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/restrict-template-expressions': 'off',
    'no-console': ['error', { allow: ['error', 'warn'] }],
    quotes: ['error', 'single', { avoidEscape: true }],
    'no-void': ['error', { allowAsStatement: true }],
  },
}
