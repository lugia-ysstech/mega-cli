/**
 * Created Date: Friday, June 29th 2018, 5:25:05 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2018 @lugia
 * ------------------------------------
 * Javascript will save your soul!
 */

/**
 * TODO:
 *
 * export 分别导出
 * import { isPlainObject } from '@lugia/mega-utils/lib/is';
 *
 */

// Usage
//
// is('dd');
// => 'string'
// is(new Map());
// => 'Map'
// is.number(6);
// => true

const { toString } = Object.prototype;
const getObjectType = x => toString.call(x).slice(8, -1);
const isOfType = type => x => typeof x === type; // eslint-disable-line valid-typeof
const isObjectOfType = type => x => getObjectType(x) === type;

/**
 * Returns the type of value.
 * Primitives are lowercase and object types are camelcase.
 *
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
const is = value => {
  if (value === null) {
    return 'null';
  }

  if (value === true || value === false) {
    return 'boolean';
  }

  const type = typeof value;

  if (type === 'undefined') {
    return 'undefined';
  }

  if (type === 'string') {
    return 'string';
  }

  if (type === 'number') {
    return 'number';
  }

  if (type === 'symbol') {
    return 'symbol';
  }

  if (is.function(value)) {
    return 'Function';
  }

  if (Array.isArray(value)) {
    return 'Array';
  }

  const tagType = getObjectType(value);
  if (tagType) {
    return tagType;
  }

  if (
    value instanceof String ||
    value instanceof Boolean ||
    value instanceof Number
  ) {
    throw new TypeError("Please don't use object wrappers for primitive types");
  }

  return 'Object';
};

is.undefined = isOfType('undefined');
is.null = x => x === null;
is.string = isOfType('string');
is.number = isOfType('number');
is.boolean = x => x === true || x === false;
is.symbol = isOfType('symbol');

is.array = Array.isArray;
is.function = isOfType('function');

const isObject = x => typeof x === 'object';

// Keep in mind that functions are objects too.
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions
is.object = x => !is.nullOrUndefined(x) && (is.function(x) || isObject(x));

// An object is plain if it's created by either {}, new Object(), or Object.create(null).
is.plainObject = x => {
  // From: https://github.com/sindresorhus/is-plain-obj/blob/master/index.js
  let prototype;
  // eslint-disable-next-line no-return-assign
  return (
    getObjectType(x) === 'Object' &&
    ((prototype = Object.getPrototypeOf(x)),
    prototype === null || prototype === Object.getPrototypeOf({}))
  );
};

is.nativePromise = isObjectOfType('Promise');

const hasPromiseAPI = x =>
  !is.null(x) && isObject(x) && is.function(x.then) && is.function(x.catch);

// Returns true for any object with a .then() and .catch() method.
// Prefer this one over .nativePromise() as you usually want to
// allow userland promise implementations too.
is.promise = x => is.nativePromise(x) || hasPromiseAPI(x);

// Returns true for any object that implements its own .next() and .throw() methods
// and has a function definition for Symbol.iterator.
is.generator = x =>
  is.iterable(x) && is.function(x.next) && is.function(x.throw);

const isFunctionOfType = type => x =>
  is.function(x) && is.function(x.constructor) && x.constructor.name === type;

is.generatorFunction = isFunctionOfType('GeneratorFunction');

// Returns true for any async function that can be called with the await operator.
// is.asyncFunction(async () => {});
// => true
// is.asyncFunction(() => {});
// => false
is.asyncFunction = isFunctionOfType('AsyncFunction');

is.regExp = isObjectOfType('RegExp');
is.date = isObjectOfType('Date');
is.error = isObjectOfType('Error');
is.map = isObjectOfType('Map');
is.set = isObjectOfType('Set');
is.weakMap = isObjectOfType('WeakMap');
is.weakSet = isObjectOfType('WeakSet');

is.int8Array = isObjectOfType('Int8Array');
is.uint8Array = isObjectOfType('Uint8Array');
is.uint8ClampedArray = isObjectOfType('Uint8ClampedArray');
is.int16Array = isObjectOfType('Int16Array');
is.uint16Array = isObjectOfType('Uint16Array');
is.int32Array = isObjectOfType('Int32Array');
is.uint32Array = isObjectOfType('Uint32Array');
is.float32Array = isObjectOfType('Float32Array');
is.float64Array = isObjectOfType('Float64Array');

is.arrayBuffer = isObjectOfType('ArrayBuffer');
is.sharedArrayBuffer = isObjectOfType('SharedArrayBuffer');

// Returns true for all values that evaluate to true in a boolean context:
//
// is.truthy('dd');
// => true
// is.truthy(undefined);
// => false
is.truthy = x => !!x; // eslint-disable-line no-implicit-coercion

// Returns true if value is one of: false, 0, '', null, undefined, NaN.
is.falsy = x => !x;

is.nan = Number.isNaN;
is.nullOrUndefined = x => is.null(x) || is.undefined(x);

const primitiveTypes = new Set([
  'undefined',
  'string',
  'number',
  'boolean',
  'symbol',
]);
// JavaScript primitives are as follows: null, undefined, string, number, boolean, symbol.
is.primitive = x => is.null(x) || primitiveTypes.has(typeof x);

is.integer = Number.isInteger;

// Returns true if value is a safe integer.
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger
is.safeInteger = Number.isSafeInteger;

is.iterable = x => !is.nullOrUndefined(x) && is.function(x[Symbol.iterator]);

// Returns true for instances created by a ES2015 class.
is.class = x => is.function(x) && x.toString().startsWith('class ');

const typedArrayTypes = new Set([
  'Int8Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'Int16Array',
  'Uint16Array',
  'Int32Array',
  'Uint32Array',
  'Float32Array',
  'Float64Array',
]);
is.typedArray = x => typedArrayTypes.has(getObjectType(x));

// Check if value (number) is in the given range.
// The range is an array of two values, lower bound and upper bound, in no specific order.
// is.inRange(3, [0, 5]);
// is.inRange(3, [5, 0]);
// is.inRange(0, [-2, 2]);
//
// Check if value (number) is in the range of 0 to upperBound.
// is.inRange(3, 10);
is.inRange = (x, range) => {
  if (is.number(range)) {
    return x >= Math.min(0, range) && x <= Math.max(range, 0);
  }

  if (is.array(range) && range.length === 2) {
    return x >= Math.min.apply(null, range) && x <= Math.max.apply(null, range);
  }

  throw new TypeError(`Invalid range: ${range}`);
};

const NODE_TYPE_ELEMENT = 1;
const DOM_PROPERTIES_TO_CHECK = [
  'innerHTML',
  'ownerDocument',
  'style',
  'attributes',
  'nodeValue',
];

// Returns true if value is a DOM Element.
is.domElement = x =>
  is.object(x) &&
  x.nodeType === NODE_TYPE_ELEMENT &&
  is.string(x.nodeName) &&
  !is.plainObject(x) &&
  DOM_PROPERTIES_TO_CHECK.every(property => property in x);

// Check if value is Infinity or -Infinity.
is.infinite = x => x === Infinity || x === -Infinity;

const isAbsoluteMod2 = value => x => is.integer(x) && Math.abs(x % 2) === value;

// Returns true if value is an even integer.
is.even = isAbsoluteMod2(0);

// Returns true if value is an odd integer.
is.odd = isAbsoluteMod2(1);

const isWhiteSpaceString = x => is.string(x) && /\S/.test(x) === false;
const isEmptyStringOrArray = x =>
  (is.string(x) || is.array(x)) && x.length === 0;
const isEmptyObject = x =>
  !is.map(x) && !is.set(x) && is.object(x) && Object.keys(x).length === 0;
const isEmptyMapOrSet = x => (is.map(x) || is.set(x)) && x.size === 0;

// Returns true if value is falsy or an empty string, array, object, map, or set.
is.empty = x =>
  is.falsy(x) ||
  isEmptyStringOrArray(x) ||
  isEmptyObject(x) ||
  isEmptyMapOrSet(x);

// Returns true if is.empty(value) or a string that is all whitespace.
is.emptyOrWhitespace = x => is.empty(x) || isWhiteSpaceString(x);

const predicateOnArray = (method, predicate, values) => {
  // `values` is the calling function's "arguments object".
  // So here we convert it to an array and slice off the first item.
  values = Array.prototype.slice.call(values, 1);

  if (is.function(predicate) === false) {
    throw new TypeError(`Invalid predicate: ${predicate}`);
  }

  if (values.length === 0) {
    throw new TypeError('Invalid number of values');
  }

  return method.call(values, predicate);
};

// Returns true if any of the input values returns true in the predicate:
//
// is.any(is.string, {}, true, 'dd');
// => true
// is.any(is.boolean, 'unicorns', [], new Map());
// => false
is.any = predicate =>
  predicateOnArray(Array.prototype.some, predicate, arguments);

// Returns true if all of the input values returns true in the predicate:
//
// is.all(is.object, {}, new Map(), new Set());
// => true
// is.all(is.string, 'dd', [], 'unicorns');
// => false
is.all = predicate =>
  predicateOnArray(Array.prototype.every, predicate, arguments);

export default is;
