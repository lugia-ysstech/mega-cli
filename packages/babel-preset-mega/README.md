# @lugia/babel-preset-mega

## Usage

First, [install Babel](https://babeljs.io/docs/setup/).

Then install @lugia/babel-preset-mega.

```sh
yarn add @lugia/babel-preset-mega
```

Then create a file named `.babelrc` with following contents in the root folder of your project:

```json
{
  "presets": ["@lugia/mega"]
}
```

This preset uses the `useBuiltIns` option with [transform-object-rest-spread](http://babeljs.io/docs/plugins/transform-object-rest-spread/) and [transform-react-jsx](http://babeljs.io/docs/plugins/transform-react-jsx/), which assumes that `Object.assign` is available or polyfilled.

## Usage with Flow

Make sure you have a .flowconfig file at the root directory. You can also use the flow option on .babelrc:

```json
{
  "presets": [["@lugia/mega", { "flow": true, "typescript": false }]]
}
```

## Usage with TypeScript

Make sure you have a tsconfig.json file at the root directory. You can also use the typescript option on .babelrc:

```json
{
  "presets": [["@lugia/mega", { "flow": false, "typescript": true }]]
}
```
