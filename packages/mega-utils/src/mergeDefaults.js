import Immutable from 'immutable';

/**
 * Merge
 * @param  {Object|Map} src
 * @param  {Object|Map} merge
 * @return {Object}
 */
export default function mergeDefaults(src, merge) {
  const srcValue = Immutable.fromJS(src);
  const mergeValue = Immutable.fromJS(merge);

  return srcValue.mergeDeep(mergeValue).toJS();
}
