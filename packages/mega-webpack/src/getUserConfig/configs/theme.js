import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';
import { existsSync } from 'fs';
import { join } from 'path';

export default function() {
  return {
    name: 'theme',
    validate(val) {
      assert(
        is.plainObject(val) || is.string(val),
        `The theme config must be Plain Object or String, but got ${val}`,
      );

      const { cwd } = this;
      if (is.string(val)) {
        const themeFile = join(cwd, val);
        assert(
          existsSync(themeFile),
          `File ${val} of configure item theme not found.`,
        );
      }
    },
  };
}
