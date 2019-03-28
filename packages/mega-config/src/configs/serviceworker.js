import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'serviceworker',
    validate(val) {
      assert(
        is.plainObject(val),
        `The serviceworker config must be Plain Object, but got ${val}`,
      );
    },
  };
}
