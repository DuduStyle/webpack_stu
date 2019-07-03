module.exports = {
  parser: "babel-eslint",
  extends: ["airbnb", "prettier", "plugin:prettier/recommended"],
  env: {
    browser: true,
    node: true,
    es6: true
  },
  rules: {
    // indent: ["error", 4]
  }
};
