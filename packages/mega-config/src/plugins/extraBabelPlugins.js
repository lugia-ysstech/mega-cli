import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'extraBabelPlugins',
    validate(val) {
      assert(
        is.array(val),
        `The extraBabelPlugins config must be Array, but got ${val}`,
      );
    },
  };
}
