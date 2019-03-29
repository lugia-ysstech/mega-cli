import { join } from 'path';
import requireindex from 'requireindex';

export default function() {
  const pluginsMap = requireindex(join(__dirname, './plugins'));
  return Object.keys(pluginsMap).map(key => {
    return pluginsMap[key]();
  });
}
