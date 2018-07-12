import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'entry',
    validate(val) {
      assert(
        is.plainObject(val) || is.string(val),
        `The entry config must be Plain Object or String, but got ${val}`,
      );
    },
  };
}
