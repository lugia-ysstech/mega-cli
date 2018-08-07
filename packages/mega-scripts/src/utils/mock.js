import { existsSync } from 'fs';
import assert from 'assert';
import chokidar from 'chokidar';
import chalk from 'chalk';
import proxy from 'express-http-proxy';
import url from 'url';
import { join } from 'path';
import bodyParser from 'body-parser';
import is from '@lugia/mega-utils/lib/is';
import getPaths from './getPaths';
import winPath from './winPath';

const debug = require('debug')('@lugia/mega-scripts:mock');

let error = null;
const paths = getPaths(process.cwd());
const mockConfigFile = paths.resolveApp('mock.config.js');
const mockDir = paths.resolveApp('./mock/');

function getConfig() {
  if (existsSync(mockConfigFile)) {
    // disable require cache
    Object.keys(require.cache).forEach(file => {
      if (file === mockConfigFile || file.indexOf(mockDir) > -1) {
        debug(`delete cache ${file}`);
        delete require.cache[file];
      }
    });
    return require(mockConfigFile); // eslint-disable-line
  } else {
    return {};
  }
}

function createMockHandler(method, path, value) {
  return function mockHandler(...args) {
    const res = args[1];
    if (is.function(value)) {
      value(...args);
    } else {
      res.json(value);
    }
  };
}

function createProxy(method, path, target) {
  return proxy(target, {
    filter(req) {
      return method ? req.method.toLowerCase() === method.toLowerCase() : true;
    },
    forwardPath(req) {
      let matchPath = req.originalUrl;
      const matches = matchPath.match(path);
      if (matches.length > 1) {
        [, matchPath] = matches;
      }
      return winPath(join(url.parse(target).path, matchPath));
    },
  });
}

export function applyMock(devServer) {
  try {
    realApplyMock(devServer);
    error = null;
  } catch (e) {
    console.log(e);
    error = e;

    console.log();
    outputError();

    const watcher = chokidar.watch([mockConfigFile, mockDir], {
      ignored: /node_modules/,
      ignoreInitial: true,
    });
    watcher.on('change', path => {
      console.log(
        chalk.green('CHANGED'),
        path.replace(paths.appDirectory, '.'),
      );
      watcher.close();
      applyMock(devServer);
    });
  }
}

function realApplyMock(devServer) {
  const config = getConfig();
  const { app } = devServer;

  devServer.use(bodyParser.json({ limit: '5mb', strict: false }));
  devServer.use(
    bodyParser.urlencoded({
      extended: true,
      limit: '5mb',
    }),
  );

  Object.keys(config).forEach(key => {
    const keyParsed = parseKey(key);
    const { method } = keyParsed;
    let { path } = keyParsed;

    assert(!!app[method], `method of ${key} is not valid`);
    assert(
      is.function(config[key]) ||
        is.object(config[key]) ||
        is.string(config[key]),
      `mock value of ${key} should be function or object or string, but got ${is(
        config[key],
      )}`,
    );

    if (is.string(config[key])) {
      if (/\(.+\)/.test(path)) {
        path = new RegExp(`^${path}$`);
      }
      app.use(path, createProxy(method, path, config[key]));
    } else {
      app[method](path, createMockHandler(method, path, config[key]));
    }
  });

  // 调整 stack，把 historyApiFallback 放到最后
  let lastIndex = null;
  app._router.stack.forEach((item, index) => {
    if (item.name === 'webpackDevMiddleware') {
      lastIndex = index;
    }
  });
  const mockAPILength = app._router.stack.length - 1 - lastIndex;
  if (lastIndex && lastIndex > 0) {
    const newStack = app._router.stack;
    newStack.push(newStack[lastIndex - 1]);
    newStack.push(newStack[lastIndex]);
    newStack.splice(lastIndex - 1, 2);
    app._router.stack = newStack;
  }

  const watcher = chokidar.watch([mockConfigFile, mockDir], {
    ignored: /node_modules/,
    persistent: true,
  });
  watcher.on('change', path => {
    console.log(chalk.green('CHANGED'), path.replace(paths.appDirectory, '.'));
    watcher.close();

    // 删除旧的 mock api
    app._router.stack.splice(lastIndex - 1, mockAPILength);

    applyMock(devServer);
  });
}

function parseKey(key) {
  let method = 'get';
  let path = key;

  if (key.indexOf(' ') > -1) {
    const splited = key.split(' ');
    method = splited[0].toLowerCase();
    [, path] = splited;
  }

  return { method, path };
}

export function outputError() {
  if (!error) return;

  const filePath = error.message.split(': ')[0];
  const relativeFilePath = filePath.replace(paths.appDirectory, '.');
  const errors = error.stack
    .split('\n')
    .filter(line => line.trim().indexOf('at ') !== 0)
    .map(line => line.replace(`${filePath}: `, ''));
  errors.splice(1, 0, ['']);

  console.log(chalk.red('Failed to parse mock config.'));
  console.log();
  console.log(`Error in ${relativeFilePath}`);
  console.log(errors.join('\n'));
  console.log();
}
