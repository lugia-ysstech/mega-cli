/**
 * Created Date: Friday, July 12th 2019, 4:12:50 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Monday, July 15th 2019, 3:40:51 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2019-present, #Lugia#.
 * ------------------------------------
 * JavaScript will save your soul!
 */

// The ESLint browser environment defines all browser globals as valid,
// even though most people don't know some of them exist (e.g. `name` or `status`).
// This is dangerous as it hides accidentally undefined variables.
// We blacklist the globals that we deem potentially confusing.
// To use them, explicitly reference them, e.g. `window.name` or `window.status`.
// https://github.com/facebook/create-react-app/blob/master/packages/confusing-browser-globals/README.md
const restrictedGlobals = require('confusing-browser-globals');

module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  root: true,

  parser: require.resolve('babel-eslint'),
  extends: [
    require.resolve('eslint-config-airbnb'),
    'plugin:prettier/recommended',
    require.resolve('eslint-config-prettier/flowtype'),
    require.resolve('eslint-config-prettier/react')
  ],
  plugins: [
    'flowtype',
    'import',
    'promise',
    'compat',
    'jsx-a11y',
    'react',
    'react-hooks'
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    },
    allowImportExportEverywhere: true
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true
  },
  settings: {
    ...(process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'production'
      ? {
          react: {
            version: 'detect'
          }
        }
      : {})
  },

  // https://github.com/typescript-eslint/typescript-eslint
  // https://github.com/prettier/eslint-config-prettier/blob/master/%40typescript-eslint.js
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        },

        // typescript-eslint specific options
        warnOnUnsupportedTypeScriptVersion: true
      },
      extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/@typescript-eslint'
      ],
      plugins: ['@typescript-eslint'],
      // If adding a typescript-eslint version of an existing ESLint rule,
      // make sure to disable the ESLint rule here.
      rules: {
        // TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
        'default-case': 'off',
        // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
        'no-dupe-class-members': 'off',
        // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/477)
        'no-undef': 'off',

        // Add TypeScript specific rules (and turn off ESLint equivalents)
        '@typescript-eslint/no-angle-bracket-type-assertion': 'warn',
        'no-array-constructor': 'off',
        '@typescript-eslint/no-array-constructor': 'warn',
        '@typescript-eslint/no-namespace': 'error',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': [
          'warn',
          {
            functions: false,
            classes: false,
            variables: false,
            typedefs: false
          }
        ],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            args: 'none',
            ignoreRestSiblings: true
          }
        ],
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'warn'
      }
    }
  ],
  rules: {
    'arrow-parens': 'off',
    'compat/compat': 'error',
    'consistent-return': 'off',
    'comma-dangle': 'off',
    'flowtype/boolean-style': ['error', 'boolean'],
    'flowtype/define-flow-type': 'warn',
    'flowtype/delimiter-dangle': ['error', 'never'],
    'flowtype/generic-spacing': ['error', 'never'],
    'flowtype/no-primitive-constructor-types': 'error',
    'flowtype/no-weak-types': 'warn',
    'flowtype/object-type-delimiter': ['error', 'comma'],
    'flowtype/require-parameter-type': 'off',
    'flowtype/require-return-type': 'off',
    'flowtype/require-valid-file-annotation': 'off',
    'flowtype/semi': ['error', 'always'],
    'flowtype/space-after-type-colon': ['error', 'always'],
    'flowtype/space-before-generic-bracket': ['error', 'never'],
    'flowtype/space-before-type-colon': ['error', 'never'],
    'flowtype/union-intersection-spacing': ['error', 'always'],
    'flowtype/use-flow-type': 'error',
    'flowtype/valid-syntax': 'error',
    'generator-star-spacing': 'off',
    'import/no-unresolved': 'error',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'jsx-a11y/anchor-is-valid': 'off',
    'no-console': 'off',
    'no-use-before-define': 'off',
    'no-multi-assign': 'off',

    // https://github.com/facebook/create-react-app/blob/master/packages/eslint-config-react-app/index.js
    'no-restricted-globals': ['error'].concat(restrictedGlobals),
    'no-restricted-properties': [
      'error',
      {
        object: 'require',
        property: 'ensure',
        message:
          'Please use import() instead. More info: https://facebook.github.io/create-react-app/docs/code-splitting'
      },
      {
        object: 'System',
        property: 'import',
        message:
          'Please use import() instead. More info: https://facebook.github.io/create-react-app/docs/code-splitting'
      }
    ],

    // https://github.com/prettier/eslint-plugin-prettier
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        overrides: [
          {
            files: ['*.js', '*.jsx'],
            options: { parser: 'flow' }
          }
        ]
      },
      {
        usePrettierrc: false,
        fileInfoOptions: {
          ignorePath: '# use .eslintignore'
        }
      }
    ],

    'promise/param-names': 'error',
    'promise/always-return': 'error',
    'promise/catch-or-return': 'error',
    'promise/no-native': 'off',
    'react/sort-comp': [
      'error',
      {
        order: [
          'type-annotations',
          'static-methods',
          'lifecycle',
          'everything-else',
          'render'
        ]
      }
    ],
    'react/jsx-no-bind': 'off',
    'react/jsx-filename-extension': [
      'error',
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] }
    ],
    'react/prefer-stateless-function': 'off',

    // https://github.com/facebook/react/tree/master/packages/eslint-plugin-react-hooks
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error'
  }
};
