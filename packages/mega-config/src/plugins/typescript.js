import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'typescript',
    validate(val) {
      assert(
        is.plainObject(val),
        `The typescript config must be Plain Object, but got ${val}`,
      );
    },
  };
}
