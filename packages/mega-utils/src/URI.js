/**
 * Created Date: Wednesday, April 24th 2019, 7:07:49 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Thursday, April 25th 2019, 4:24:18 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2019-present, #Lugia#.
 * ------------------------------------
 * JavaScript will save your soul!
 */

// https://github.com/garycourt/uri-js
import * as URI from 'uri-js';
// https://github.com/moxystudio/js-proper-url-join
import urlJoin from 'proper-url-join';
// https://github.com/jonschlinkert/normalize-path
import pathNormalize from 'normalize-path';
import is from './is';

const {
  parse,
  serialize,
  resolve,
  resolveComponents,
  normalize,
  equal,
  removeDotSegments,
  pctEncChar,
  pctDecChars,
  escapeComponent,
  unescapeComponent,
} = URI;

/**
 * A light-weight module that brings path.join to Browser
 * @param {String} part
 * @param {Object} options
 * options: Object
 *  leadingSlash: boolean, Add a leading /
 *  trailingSlash: boolean, Add a trailing /
 */
function pathJoin(...args) {
  const lastArg = args.pop();
  let options;

  if (is.object(lastArg)) {
    options = lastArg;
  } else {
    args.push(lastArg);
  }

  args = args.map(arg => {
    return pathNormalize(arg, false);
  });

  const firstPart = args[0];
  const lastPart = args[args.length - 1];

  // Parse options
  options = {
    leadingSlash: firstPart.startsWith('/'),
    trailingSlash: lastPart.endsWith('/'),
    ...options,
  };

  return urlJoin(...args, options).replace(/^\.\//, '');
}

URI.urlJoin = urlJoin;
URI.pathNormalize = pathNormalize;
URI.pathJoin = pathJoin;

export default URI;

export {
  urlJoin,
  pathNormalize,
  pathJoin,
  parse,
  serialize,
  resolve,
  resolveComponents,
  normalize,
  equal,
  removeDotSegments,
  pctEncChar,
  pctDecChars,
  escapeComponent,
  unescapeComponent,
};
