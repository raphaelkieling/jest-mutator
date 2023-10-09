module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["standard-with-typescript", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  ignorePatterns: ["node_modules/", "dist/", ".eslintrc.js"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  rules: {
    quotes: ["error", "double"],
  },
};
