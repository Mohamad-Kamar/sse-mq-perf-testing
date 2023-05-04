module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'import/extensions': [
      'error',
      {
        js: 'ignorePackages',
      },
    ],
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'linebreak-style': 0,
  },
};
