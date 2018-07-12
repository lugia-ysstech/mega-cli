import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'urlLoaderExcludes',
    validate(val) {
      assert(
        is.array(val),
        `The urlLoaderExcludes config must be Array, but got ${val}`,
      );
    },
  };
}
