import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'disableDynamicImport',
    validate(val) {
      assert(
        is.boolean(val),
        `The disableDynamicImport config must be Boolean, but got ${val}`,
      );
    },
  };
}
