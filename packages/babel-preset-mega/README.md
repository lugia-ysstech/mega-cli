# @lugia/babel-preset-mega

## Usage

First, [install Babel](https://babeljs.io/docs/setup/).

Then install babel-preset-mega.

```sh
yarn add babel-preset-mega
```

Then create a file named `.babelrc` with following contents in the root folder of your project:

```json
{
  "presets": ["mega"]
}
```

This preset uses the `useBuiltIns` option with [transform-object-rest-spread](http://babeljs.io/docs/plugins/transform-object-rest-spread/) and [transform-react-jsx](http://babeljs.io/docs/plugins/transform-react-jsx/), which assumes that `Object.assign` is available or polyfilled.

## Usage with TypeScript

To use this package with [`@babel/preset-typescript`](https://www.npmjs.com/package/@babel/preset-typescript), you need to disable `@babel/preset-flow` first.

You can achieve this by doing:

```json
{
  "presets": [
    [
      "mega",
      {
        "flow": false
      }
    ],
    "@babel/typescript"
  ]
}
```
