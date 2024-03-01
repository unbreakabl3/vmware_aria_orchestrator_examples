const globals = require( 'globals' );
const typescriptParser = require( '@typescript-eslint/parser' );
const tseslint = require( '@typescript-eslint/eslint-plugin' );
const stylisticTs = require( '@stylistic/eslint-plugin' )
const eslint = require( '@eslint/js' )
const oxlint = require( 'eslint-plugin-oxlint' )


module.exports = [
  eslint.configs.recommended,
  {
    ignores: [ "target/" ],
  },
  {
    files: [ "**/*.ts" ],
    rules: {
      "eqeqeq": "error",
      "no-undef": "off",
      "no-unused-vars": "off",
      "stylistic/block-spacing": [ "error", "always" ],
      "stylistic/max-len": [ "warn", { "code": 170 } ],
      "stylistic/type-annotation-spacing": [ "error", { "before": false, "after": true } ],
      "tseslint/array-type": [ "error", { default: 'generic' } ]
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
      },
    },
    plugins: {
      tseslint: tseslint,
      stylistic: stylisticTs,
      oxc: oxlint
    },
    rules: {
    }
  }
]