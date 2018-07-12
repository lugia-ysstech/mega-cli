import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'extraPostCSSPlugins',
    validate(val) {
      assert(
        is.array(val),
        `The extraPostCSSPlugins config must be Array, but got ${val}`,
      );
    },
  };
}
