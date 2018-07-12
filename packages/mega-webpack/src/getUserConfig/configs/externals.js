import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'externals',
    validate(val) {
      assert(
        is.plainObject(val) || is.function(val),
        `The externals config must be Plain Object or Function, but got ${val}`,
      );
    },
  };
}
