import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'ignoreMomentLocale',
    validate(val) {
      assert(
        is.boolean(val),
        `The ignoreMomentLocale config must be Boolean, but got ${val}`,
      );
    },
  };
}
