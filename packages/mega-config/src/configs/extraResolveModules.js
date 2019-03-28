import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'extraResolveModules',
    validate(val) {
      assert(
        is.array(val),
        `The extraResolveModules config must be Array, but got ${val}`,
      );
    },
  };
}
