// Inspired:
// https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babelruntime-for-target-environment
// https://github.com/babel/babel/issues/10008
// https://github.com/facebook/create-react-app/blob/master/packages/babel-preset-react-app/README.md
import { join, dirname } from 'path';

export default (api, opts = {}) => {
  // This is similar to how `env` works in Babel:
  // https://babeljs.io/docs/usage/babelrc/#env-option
  // We are not using `env` because it’s ignored in versions > babel-core@6.10.4:
  // https://github.com/babel/babel/issues/4539
  // https://github.com/facebook/create-react-app/issues/720
  // It’s also nice that we can enforce `NODE_ENV` being specified.
  const env = validateOption(
    'env',
    opts.env || process.env.BABEL_ENV || process.env.NODE_ENV,
    ''
  );
  const isEnvDevelopment = env === 'development';
  const isEnvProduction = env === 'production';
  const isEnvTest = env === 'test';
  const { engine, cwd = process.cwd() } = opts;
  let pkg = {};
  try {
    pkg = require(join(cwd, 'package.json')); // eslint-disable-line
  } catch (e) {} // eslint-disable-line
  const useESModules = validateOption(
    'useESModules',
    opts.useESModules,
    isEnvDevelopment || isEnvProduction
  );
  const isFlowEnabled = validateOption('flow', opts.flow, true);
  const isTypeScriptEnabled = validateOption(
    'typescript',
    opts.typescript,
    true
  );
  const areHelpersEnabled = validateOption('helpers', opts.helpers, true);
  const useAbsoluteRuntime = validateOption(
    'absoluteRuntime',
    opts.absoluteRuntime,
    engine !== 'nodeApp'
  );

  let absoluteRuntimePath;
  if (useAbsoluteRuntime) {
    absoluteRuntimePath = dirname(
      require.resolve('@babel/runtime/package.json')
    );
  }

  if (!isEnvDevelopment && !isEnvProduction && !isEnvTest) {
    throw new Error(
      `${'Using `@lugia/babel-preset-mega` requires that you specify `NODE_ENV` or ' +
        '`BABEL_ENV` environment variables. Valid values are "development", ' +
        '"test", and "production". Instead, received: '}${JSON.stringify(env)}.`
    );
  }

  if (
    engine === 'nodeApp' &&
    !(pkg.dependencies && pkg.dependencies['@babel/runtime'])
  ) {
    throw new Error(
      `@lugia/babel-preset-mega: engine option is 'nodeApp', need '@babel/runtime' dependency, run 'yarn add @babel/runtime' to install.`
    );
  }

  return {
    presets: [
      isEnvTest && [
        // ES features necessary for user's Node version
        require.resolve('@babel/preset-env'),
        {
          targets: opts.targets || {
            node: 'current'
          }
        }
      ],
      (isEnvProduction || isEnvDevelopment) && [
        // Latest stable ECMAScript features
        require.resolve('@babel/preset-env'),
        {
          // Allow importing core-js in entrypoint and use browserlist to select polyfills
          useBuiltIns: opts.useBuiltIns || 'entry',
          corejs: 3,
          // Do not transform modules to CJS
          modules: false,
          // Exclude transforms that make all code slower
          exclude: ['transform-typeof-symbol'],
          targets: opts.targets || {
            browsers: opts.browsers || ['last 2 versions', 'ie 10']
          },
          ignoreBrowserslistConfig: true
        }
      ],
      [
        require.resolve('@babel/preset-react'),
        {
          // Adds component stack to warning messages
          // Adds __self attribute to JSX which React will use for some warnings
          development: isEnvDevelopment || isEnvTest,
          // Will use the native built-in instead of trying to polyfill
          // behavior for any plugins that require one.
          useBuiltIns: true
        }
      ],
      isTypeScriptEnabled && [require.resolve('@babel/preset-typescript')]
    ].filter(Boolean),
    plugins: [
      // Strip flow types before any other transform, emulating the behavior
      // order as-if the browser supported all of the succeeding features
      // https://github.com/facebook/create-react-app/pull/5182
      // We will conditionally enable this plugin below in overrides as it clashes with
      // @babel/plugin-proposal-decorators when using TypeScript.
      // https://github.com/facebook/create-react-app/issues/5741
      isFlowEnabled && [
        require.resolve('@babel/plugin-transform-flow-strip-types'),
        false
      ],
      // Experimental macros support. Will be documented after it's had some time
      // in the wild.
      require.resolve('babel-plugin-macros'),
      // Necessary to include regardless of the environment because
      // in practice some other transforms (such as object-rest-spread)
      // don't work without it: https://github.com/babel/babel/issues/7215
      [
        require.resolve('@babel/plugin-transform-destructuring'),
        {
          // Use loose mode for performance:
          // https://github.com/facebook/create-react-app/issues/5602
          loose: false,
          selectiveLoose: [
            'useState',
            'useEffect',
            'useContext',
            'useReducer',
            'useCallback',
            'useMemo',
            'useRef',
            'useImperativeHandle',
            'useLayoutEffect',
            'useDebugValue'
          ]
        }
      ],
      // Turn on legacy decorators for TypeScript files
      isTypeScriptEnabled && [
        require.resolve('@babel/plugin-proposal-decorators'),
        false
      ],
      // class { handleClick = () => { } }
      // Enable loose mode to use assignment instead of defineProperty
      // See discussion in https://github.com/facebook/create-react-app/issues/4263
      [
        require.resolve('@babel/plugin-proposal-class-properties'),
        {
          loose: true
        }
      ],
      // The following two plugins use Object.assign directly, instead of Babel's
      // extends helper. Note that this assumes `Object.assign` is available.
      // { ...todo, completed: true }
      [
        require.resolve('@babel/plugin-proposal-object-rest-spread'),
        {
          useBuiltIns: true
        }
      ],
      // Polyfills the runtime needed for async/await, generators, and friends
      // https://babeljs.io/docs/en/babel-plugin-transform-runtime
      [
        require.resolve('@babel/plugin-transform-runtime'),
        {
          corejs: opts.corejs || false,
          helpers: areHelpersEnabled,
          regenerator: true,
          // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
          // We should turn this on once the lowest version of Node LTS
          // supports ES Modules.
          useESModules,
          // Undocumented option that lets us encapsulate our runtime, ensuring
          // the correct version is used
          // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
          absoluteRuntime: absoluteRuntimePath
        }
      ],
      isEnvProduction && [
        // Remove PropTypes from production build
        require.resolve('babel-plugin-transform-react-remove-prop-types'),
        {
          removeImport: true
        }
      ],
      // Adds syntax support for import()
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      isEnvTest &&
        // Transform dynamic import to require
        require.resolve('babel-plugin-dynamic-import-node'),
      // https://github.com/styled-components/babel-plugin-styled-components
      !isEnvProduction && require.resolve('babel-plugin-styled-components'),
      // add the module.exports if only the export default declaration exists.
      require.resolve('babel-plugin-add-module-exports')
    ].filter(Boolean),
    overrides: [
      isFlowEnabled && {
        exclude: /\.tsx?$/,
        plugins: [require.resolve('@babel/plugin-transform-flow-strip-types')]
      },
      isTypeScriptEnabled && {
        test: /\.tsx?$/,
        plugins: [
          [
            require.resolve('@babel/plugin-proposal-decorators'),
            { legacy: true }
          ]
        ]
      }
    ].filter(Boolean)
  };
};

function validateOption(name, value, defaultValue) {
  const validateType = isType(defaultValue);

  if (typeof value === 'undefined') {
    value = defaultValue; // eslint-disable-line
  }

  // eslint-disable-next-line
  if (typeof value !== validateType) {
    throw new Error(
      `@lugia/babel-preset-mega: '${name}' option must be a ${validateType}.`
    );
  }

  return value;
}

function isType(v) {
  if (v === null) {
    return 'null';
  }

  if (Array.isArray(v)) {
    return 'Array';
  }

  const type = typeof v;

  if (type === 'function') {
    return 'Function';
  }

  if (type === 'object') {
    return 'Object';
  }

  return type;
}
