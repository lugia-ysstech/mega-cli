import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'html',
    validate(val) {
      assert(
        is.plainObject(val),
        `The html config must be Plain Object, but got ${val}`,
      );
    },
  };
}
