import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'define',
    validate(val) {
      assert(
        is.plainObject(val),
        `The define config must be Plain Object, but got ${val}`,
      );
    },
  };
}
