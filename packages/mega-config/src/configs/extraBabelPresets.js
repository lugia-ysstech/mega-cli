import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'extraBabelPresets',
    validate(val) {
      assert(
        is.array(val),
        `The extraBabelPresets config must be Array, but got ${val}`,
      );
    },
  };
}
