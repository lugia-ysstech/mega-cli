# `@lugia/lugiad-loader`

Webpack loader for lugiad.

## Installation

```sh
yarn add -D @lugia/lugiad-loader
```

## Usage

```js
// ...
module: {
  rules: [
    // ...
    {
      test: /\.lugiad$/,
      use: ['babel-loader', '@lugia/lugiad-loader'],
    },
  ];
}
```
