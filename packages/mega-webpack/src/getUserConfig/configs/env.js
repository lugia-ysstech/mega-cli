import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'env',
    validate(val) {
      assert(
        is.plainObject(val),
        `The env config must be Plain Object, but got ${val}`,
      );
    },
  };
}
