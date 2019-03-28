import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'outputPath',
    validate(val) {
      assert(
        is.string(val),
        `The outputPath config must be String, but got ${val}`,
      );
    },
  };
}
