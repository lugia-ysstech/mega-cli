import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'babel',
    validate(val) {
      assert(
        is.plainObject(val),
        `The babel config must be Plain Object, but got ${val}`,
      );
    },
  };
}
