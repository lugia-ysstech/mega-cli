import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'extraBabelIncludes',
    validate(val) {
      assert(
        is.array(val),
        `The extraBabelIncludes config must be Array, but got ${val}`,
      );
    },
  };
}
