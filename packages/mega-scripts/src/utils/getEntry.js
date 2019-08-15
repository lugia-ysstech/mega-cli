import { join, basename, sep } from 'path';
import { existsSync } from 'fs';
import glob from 'glob';
import is from '@lugia/mega-utils/lib/is';

const webpackHotDevClientPath = require.resolve(
  '@lugia/mega-utils/lib/webpackHotDevClient'
);

// entry 支持 4 种格式：
//
// 1. 什么都没配，取 src/index.(j|t)sx?
// 2. 对象
// 3. 字符串
// 4. 数组
export default function(opts = {}) {
  const { cwd = '', entry, isBuild, polyfills = true } = opts;

  let entryObj = null;
  if (is.undefined(entry)) {
    entryObj = getEntry(getExistsDefaultEntry(cwd));
  } else if (is.string(entry)) {
    const files = getFiles(entry, cwd);
    entryObj = getEntries(files);
  } else if (is.array(entry)) {
    const files = entry.reduce((memo, entryItem) => {
      return memo.concat(getFiles(entryItem, cwd));
    }, []);
    entryObj = getEntries(files);
  } else if (is.plainObject(entry)) {
    entryObj = entry;
  } else {
    throw new Error(
      `entry should be String, Array or Plain Object, but got ${entry}`
    );
  }

  if (!isBuild) {
    entryObj = Object.keys(entryObj).reduce((memo, key) => {
      return !is.array(entryObj[key])
        ? {
            ...memo,
            [key]: [webpackHotDevClientPath, entryObj[key]]
          }
        : {
            ...memo,
            [key]: entryObj[key]
          };
    }, {});
  }

  // add setPublicPath
  if (process.env.SET_PUBLIC_PATH) {
    const setPublicPathFile = join(
      __dirname,
      '../template/setPublicPath.tpl.js'
    );
    entryObj = Object.keys(entryObj).reduce((memo, key) => {
      return {
        ...memo,
        [key]: [
          setPublicPathFile,
          ...(is.array(entryObj[key]) ? entryObj[key] : [entryObj[key]])
        ]
      };
    }, {});
  }

  // use polyfill
  if (polyfills) {
    entryObj = Object.keys(entryObj).reduce((memo, key) => {
      return {
        ...memo,
        [key]: [
          require.resolve('react-app-polyfill/ie9'),
          require.resolve('react-app-polyfill/stable'),
          ...(is.array(entryObj[key]) ? entryObj[key] : [entryObj[key]])
        ]
      };
    }, {});
  }

  return entryObj;
}

function getEntry(filePath) {
  const key = basename(filePath).replace(/\.(j|t)sx?$/, '');
  return {
    [key]: filePath
  };
}

function getFiles(entry, cwd) {
  const files = glob.sync(entry, {
    cwd
  });
  return files.map(file => {
    return file.charAt(0) === '.' ? file : `.${sep}${file}`;
  });
}

function getEntries(files) {
  return files.reduce((memo, file) => {
    return {
      ...memo,
      ...getEntry(file)
    };
  }, {});
}

function getExistsDefaultEntry(cwd) {
  if (existsSync(join(cwd, './src/index.js'))) {
    return './src/index.js';
  }
  if (existsSync(join(cwd, './src/index.jsx'))) {
    return './src/index.jsx';
  }
  if (existsSync(join(cwd, './src/index.ts'))) {
    return './src/index.ts';
  }
  if (existsSync(join(cwd, './src/index.tsx'))) {
    return './src/index.tsx';
  }
  // default
  return './src/index.js';
}
