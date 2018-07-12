import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'publicPath',
    validate(val) {
      assert(
        is.string(val),
        `The publicPath config must be String, but got ${val}`,
      );
    },
  };
}
