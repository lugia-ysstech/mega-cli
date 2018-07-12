import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'manifest',
    validate(val) {
      assert(
        is.plainObject(val),
        `The entry config must be Plain Object, but got ${val}`,
      );
    },
  };
}
