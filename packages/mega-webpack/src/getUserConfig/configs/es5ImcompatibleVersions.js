import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'es5ImcompatibleVersions',
    validate(val) {
      assert(
        is.boolean(val),
        `The es5ImcompatibleVersions config must be Boolean, but got ${val}`,
      );
    },
  };
}
