const globals = require("globals");
const typescriptParser = require("@typescript-eslint/parser");
const tseslint = require("@typescript-eslint/eslint-plugin");
const stylisticTs = require("@stylistic/eslint-plugin");
const eslint = require("@eslint/js");
const oxlint = require("eslint-plugin-oxlint");
//const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = [
  eslint.configs.recommended,
  {
    ignores: ["target/"]
  },
  {
    files: ["**/*.ts"],
    rules: {
      eqeqeq: "error",
      "no-undef": "off",
      "no-unused-vars": "off",
      "stylistic/max-len": ["warn", { code: 170 }],
      "stylistic/arrow-parens": ["warn", "always"],
      //"stylistic/space-before-function-paren": ["warn", "always"],
      //"stylistic/space-in-parens": ["warn", "always"],
      "stylistic/block-spacing": ["warn", "always"],
      "stylistic/quotes": ["error", "double"],
      "stylistic/no-trailing-spaces": ["warn", { skipBlankLines: true }],
      "stylistic/comma-spacing": ["warn", { before: false, after: true }],
      "stylistic/type-annotation-spacing": ["error", { before: false, after: true }],
      "tseslint/array-type": ["error", { default: "generic" }]
    }
  },
  {
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "commonjs",
        ecmaVersion: 6
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es6,
        ...globals.commonjs
      }
    },
    plugins: {
      tseslint: tseslint,
      stylistic: stylisticTs,
      _oxc: oxlint,
      _eslint: eslint
    },
    rules: {}
  }
  //eslintPluginPrettierRecommended
];
