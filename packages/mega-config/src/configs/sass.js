import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'sass',
    validate(val) {
      assert(
        is.plainObject(val),
        `The sass config must be Plain Object, but got ${val}`,
      );
    },
  };
}
