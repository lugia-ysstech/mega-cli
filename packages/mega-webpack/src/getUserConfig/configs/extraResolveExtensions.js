import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'extraResolveExtensions',
    validate(val) {
      assert(
        is.array(val),
        `The extraResolveExtensions config must be Array, but got ${val}`,
      );
    },
  };
}
