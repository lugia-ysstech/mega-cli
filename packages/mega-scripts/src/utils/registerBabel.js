import { join } from 'path';
import registerBabel from '@lugia/mega-utils/lib/registerBabel';
import excapeRegExp from 'lodash.escaperegexp';
import {
  CONFIG_FILE_NAME,
  MOCK_CONFIG_FILE,
  MOCK_CONFIG_DIR,
  CONFIG_DIR,
} from './constants';

export default function(babelPreset, opts) {
  const { configOnly, disablePreventTest, ignore, cwd } = opts;
  const files = [
    CONFIG_FILE_NAME,
    MOCK_CONFIG_FILE,
    MOCK_CONFIG_DIR,
    CONFIG_DIR,
    // 'src',
  ].map(file => excapeRegExp(join(cwd, file)));
  const only = configOnly ? [new RegExp(`(${files.join('|')})`)] : null;

  registerBabel({
    only,
    ignore,
    babelPreset,
    disablePreventTest,
  });
}
