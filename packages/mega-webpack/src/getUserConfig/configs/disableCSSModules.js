import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'disableCSSModules',
    validate(val) {
      assert(
        is.boolean(val),
        `The disableCSSModules config must be Boolean, but got ${val}`,
      );
    },
  };
}
