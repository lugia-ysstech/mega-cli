# @lugia/mega-config

## Usage

```js
import getUserConfig, {
  watchConfigs,
  unwatchConfigs,
} from '@lugia/mega-config';

// get user config
let config = null;
let userPKG = null;
let returnedWatchConfig = null;
try {
  ({ config, userPKG, watch: returnedWatchConfig } = getUserConfig({
    cwd,
    configFileName: configFile || CONFIG_FILE_NAME,
  }));
  debug(`user config: ${JSON.stringify(config)}`);
} catch (e) {
  console.error(chalk.red(e.message));
  debug(`Get ${CONFIG_FILE_NAME} config failed, watch config and reload`);

  // 监听配置项变更，然后重新执行 dev 逻辑
  watchConfigs({ cwd, configFileName: CONFIG_FILE_NAME }).on(
    'all',
    (event, path) => {
      debug(`[${event}] ${path}, unwatch and reload`);
      bs && bs.active && bs.exit(); // eslint-disable-line
      bs = null;
      unwatchConfigs();
      runDev(opts);
    },
  );
  return;
}
```
