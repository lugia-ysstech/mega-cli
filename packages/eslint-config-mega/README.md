# @lugia/eslint-config-mega

> ESLint configuration used by Lugia.

**React, JSX, ES6, TypeScript and Flow syntax support**

**Breaking changes in `ESLint v6`**
[Plugins and shareable configs are no longer affected by ESLint's location](https://github.com/eslint/eslint/blob/master/docs/user-guide/migrating-to-6.0.0.md#-plugins-and-shareable-configs-are-no-longer-affected-by-eslints-location).
[https://github.com/eslint/rfcs/pull/5](https://github.com/eslint/rfcs/pull/5)

Inspired by:

- [eslint-config-airbnb](https://github.com/airbnb/javascript)
- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)
- [eslint-config-react-app](https://github.com/facebook/create-react-app/blob/master/packages/eslint-config-react-app/README.md)

Adding support for the following:

- [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)
- [eslint-plugin-flowtype](https://github.com/gajus/eslint-plugin-flowtype)
- [eslint-plugin-compat](https://github.com/amilajack/eslint-plugin-compat)
- [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react)
- [eslint-formatter-pretty](https://github.com/sindresorhus/eslint-formatter-pretty)
- [@typescript-eslint](https://github.com/typescript-eslint/typescript-eslint)
- ......

## Usage

1. Install dependencies

```bash
yarn add --dev eslint @lugia/eslint-config-mega prettier
```

2. Extend the config

```json
// .eslintrc.json
{
  "extends": "@lugia/mega"
}
```

#### Use eslint-formatter-pretty

[Pretty formatter for ESLint](https://github.com/sindresorhus/eslint-formatter-pretty)

```bash
yarn add --dev eslint-formatter-pretty
```

#### Use TypeScript

```bash
yarn add typescript
```

#### Lugia Mega

Which includes it by default.

#### ESLint CLI

```bash
eslint --format=pretty file.js
```

#### eslint-loader (webpack)

```js
module.exports = {
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          formatter: require('eslint-formatter-pretty'),
        },
      },
    ],
  },
};
```
