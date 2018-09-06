/**
 * Created Date: Friday, June 29th 2018, 4:57:39 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2018 @lugia
 * ------------------------------------
 * Javascript will save your soul!
 */

import Immutable from 'immutable';
import { purple, cyan, yellow, red, green } from './bashColor';

const COLORS = Immutable.Map({
  DEBUG: purple,
  INFO: cyan,
  WARN: yellow,
  LOADING: yellow,
  ERROR: red,
});

const lastChar = '\n';

function write(msg) {
  if (process.stdout) {
    process.stdout.write(msg + lastChar);
  }
}

function log(type, ...msg) {
  write(`${COLORS.get(type)(type.toLowerCase())} ${[...msg].join('')}`);
}

function line(str, len = 1, separator = '-') {
  const ln = new Array(Math.max(1, len - str.length)).join(separator);
  return ` ${ln} `;
}

export default {
  debug(msg) {
    log('DEBUG', msg);
  },

  info(msg) {
    log('INFO', msg);
  },

  warn(msg) {
    log('WARN', msg);
  },

  loading(msg) {
    log('LOADING', `${msg} ...`);
  },

  error(msg) {
    log('ERROR', msg);
  },

  ok(msg) {
    log('INFO', msg, ' ', green('OK'));
  },

  create(name) {
    log('INFO', 'create ', name);
  },

  list(lists = [], current) {
    const info = [''];

    lists.forEach(v => {
      const prefix = v === current ? '* ' : '  ';
      info.push(prefix + v);
    });

    info.push('');
    info.forEach(i => write(i));
  },

  br() {
    write('');
  },

  $line: line,
};
