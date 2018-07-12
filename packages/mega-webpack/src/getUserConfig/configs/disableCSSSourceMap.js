import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'disableCSSSourceMap',
    validate(val) {
      assert(
        is.boolean(val),
        `The disableCSSSourceMap config must be Boolean, but got ${val}`,
      );
    },
  };
}
