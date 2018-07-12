import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'hash',
    validate(val) {
      assert(
        is.boolean(val),
        `The hash config must be Boolean, but got ${val}`,
      );
    },
  };
}
