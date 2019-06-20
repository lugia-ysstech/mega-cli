module.exports = function(api, opts = {}, env) {
  const isEnvDevelopment = env === 'development';
  const isEnvProduction = env === 'production';
  const isEnvTest = env === 'test';
  const isFlowEnabled = validateBoolOption('flow', opts.flow, true);

  if (!isEnvDevelopment && !isEnvProduction && !isEnvTest) {
    throw new Error(
      `${'Using `@lugia/babel-preset-mega` requires that you specify `NODE_ENV` or ' +
        '`BABEL_ENV` environment variables. Valid values are "development", ' +
        '"test", and "production". Instead, received: '}${JSON.stringify(
        env,
      )}.`,
    );
  }

  return {
    presets: [
      isEnvTest && [
        // ES features necessary for user's Node version
        require.resolve('@babel/preset-env'),
        {
          targets: opts.targets || {
            node: 8,
          },
        },
      ],
      (isEnvProduction || isEnvDevelopment) && [
        // Latest stable ECMAScript features
        require.resolve('@babel/preset-env'),
        {
          // `entry` transforms `@babel/polyfill` into individual requires for
          // the targeted browsers. This is safer than `usage` which performs
          // static code analysis to determine what's required.
          // This is probably a fine default to help trim down bundles when
          // end-users inevitably import '@babel/polyfill'.
          useBuiltIns: opts.useBuiltIns || false,
          // Do not transform modules to CJS
          modules: false,
          targets: opts.targets || {
            browsers: opts.browsers || ['last 2 versions', 'ie 10'],
          },
          ignoreBrowserslistConfig: true,
        },
      ],
      [
        require.resolve('@babel/preset-react'),
        {
          // Adds component stack to warning messages
          // Adds __self attribute to JSX which React will use for some warnings
          development: isEnvDevelopment || isEnvTest,
          // Will use the native built-in instead of trying to polyfill
          // behavior for any plugins that require one.
          useBuiltIns: true,
        },
      ],
      isFlowEnabled && [require.resolve('@babel/preset-flow')],
    ].filter(Boolean),
    plugins: [
      // Experimental macros support. Will be documented after it's had some time
      // in the wild.
      require.resolve('babel-plugin-macros'),
      // Necessary to include regardless of the environment because
      // in practice some other transforms (such as object-rest-spread)
      // don't work without it: https://github.com/babel/babel/issues/7215
      require.resolve('@babel/plugin-transform-destructuring'),
      // class { handleClick = () => { } }
      // Enable loose mode to use assignment instead of defineProperty
      // See discussion in https://github.com/facebook/create-react-app/issues/4263
      [
        require.resolve('@babel/plugin-proposal-class-properties'),
        {
          loose: true,
        },
      ],
      [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
      // The following two plugins use Object.assign directly, instead of Babel's
      // extends helper. Note that this assumes `Object.assign` is available.
      // { ...todo, completed: true }
      [
        require.resolve('@babel/plugin-proposal-object-rest-spread'),
        {
          useBuiltIns: true,
        },
      ],
      // Polyfills the runtime needed for async/await and generators
      [
        require.resolve('@babel/plugin-transform-runtime'),
        {
          corejs: opts.corejs === false ? false : 2,
          helpers: opts.helpers !== false,
          regenerator: true,
          useESModules:
            opts.useESModules === false
              ? false
              : isEnvDevelopment || isEnvProduction,
        },
      ],
      isEnvProduction && [
        // Remove PropTypes from production build
        require.resolve('babel-plugin-transform-react-remove-prop-types'),
        {
          removeImport: true,
        },
      ],
      // function* () { yield 42; yield 43; }
      !isEnvTest && [
        require.resolve('@babel/plugin-transform-regenerator'),
        {
          // Async functions are converted to generators by @babel/preset-env
          async: false,
        },
      ],
      // Adds syntax support for import()
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      // add the module.exports if only the export default declaration exists.
      require.resolve('babel-plugin-add-module-exports'),
      isEnvTest &&
        // Transform dynamic import to require
        require.resolve('babel-plugin-transform-dynamic-import'),
      !isEnvProduction && require.resolve('babel-plugin-styled-components'),
    ].filter(Boolean),
  };
};

function validateBoolOption(name, value, defaultValue) {
  if (typeof value === 'undefined') {
    value = defaultValue;
  }

  if (typeof value !== 'boolean') {
    throw new Error(
      `@lugia/babel-preset-mega: '${name}' option must be a boolean.`,
    );
  }

  return value;
}
