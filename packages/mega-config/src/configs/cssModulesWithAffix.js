import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'cssModulesWithAffix',
    validate(val) {
      assert(
        is.boolean(val),
        `The cssModulesWithAffix config must be Boolean, but got ${val}`,
      );
    },
  };
}
