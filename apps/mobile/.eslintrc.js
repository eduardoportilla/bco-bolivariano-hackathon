module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      // Config files are CommonJS and don't need Babel parsing
      files: ['*.config.js', '.eslintrc.js'],
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 2022,
      },
      env: {
        node: true,
      },
    },
  ],
};
