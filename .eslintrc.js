module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier', 'plugin:prettier/recommended'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    // indent: ["error", 4]
    'import/no-extraneous-dependencies': 0,
    'global-require': 0,
    'prettier/prettier': [0, { singleQuote: true, parser: 'flow' }],
  },
};
