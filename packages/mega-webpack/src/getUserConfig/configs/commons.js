import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'commons',
    validate(val) {
      // TODO: 校验数组项的构成
      assert(is.array(val), `The commons config must be Array, but got ${val}`);
    },
  };
}
