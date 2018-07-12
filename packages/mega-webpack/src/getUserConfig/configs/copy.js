import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'copy',
    validate(val) {
      assert(is.array(val), `The copy config must be Array, but got ${val}`);
    },
  };
}
