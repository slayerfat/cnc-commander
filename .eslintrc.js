module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  plugins: [
    'html'
  ],
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // allows spaces
    'no-multi-spaces': 0,
    // forces semicolon
    'semi': ['error', 'always'],
    // disallow spaces after method names
    'space-before-function-paren': ['error', 'never'],
    // allow assignment in return statements
    'no-return-assign': 0
  }
};
