import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'alias',
    validate(val) {
      assert(
        is.plainObject(val),
        `The alias config must be Plain Object, but got ${val}`,
      );
    },
  };
}
