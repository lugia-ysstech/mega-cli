import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'browserslist',
    validate(val) {
      assert(
        is.array(val),
        `The browserslist config must be Array, but got ${val}`,
      );
    },
  };
}
