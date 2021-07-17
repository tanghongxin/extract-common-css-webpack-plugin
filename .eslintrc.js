module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint'],
  env: {
    browser: false,
    node: true,
  },
  rules: {
    quotes: ['error', 'single'],
    'eol-last': ['error', 'always'],
    indent: ['error', 2, { SwitchCase: 1 }],
    'space-before-function-paren': ['warn', 'always'],
    'key-spacing': [
      'warn',
      {
        'beforeColon': false,
        'mode': 'strict',
      },
    ],
    'no-multi-spaces': ['warn'],
  }
}
