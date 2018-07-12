import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'proxy',
    validate(val) {
      assert(
        is.plainObject(val),
        `The proxy config must be Plain Object, but got ${val}`,
      );
    },
  };
}
