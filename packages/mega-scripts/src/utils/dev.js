import { resolve } from 'path';
import { dev, applyWebpackConfig } from '@lugia/mega-webpack';
import getUserConfig, {
  watchConfigs,
  unwatchConfigs,
} from '@lugia/mega-config';
import { prepareUrls } from '@lugia/mega-utils/lib/WebpackDevServerUtils';
import is from '@lugia/mega-utils/lib/is';
import noopServiceWorkerMiddleware from '@lugia/mega-utils/lib/noopServiceWorkerMiddleware';
import chalk from 'chalk';
import browserSync from 'browser-sync';
import detect from 'detect-port';
import getWebpackConfig from './getWebpackConfig';
import getPaths from './getPaths';
import registerBabel from './registerBabel';
import { applyMock } from './mock';
import { CONFIG_FILE_NAME, DEFAULT_BROWSER_SYNC_PORT } from './constants';

const debug = require('debug')('@lugia/mega-scripts:dev');

export default function runDev(opts = {}) {
  const {
    cwd = process.cwd(),
    entry,
    applyWebpack,
    applyConfig,
    onOpenPort,
    configFile,
    _cliEnv = {},
  } = opts;

  const babel = resolve(__dirname, './babel.js');
  const paths = getPaths(cwd);

  // register babel for config files
  registerBabel(babel, {
    cwd,
    configOnly: true,
  });

  let isFirstCompile = true;
  let bs = null;

  function initBrowserSync({
    appName,
    urls,
    HOST,
    PROTOCOL,
    cwd,
    disableBrowserSync,
    autoOpenBrowser = true,
  }) {
    disableBrowserSync =
      process.env.BROWSER_SYNC === 'none' ? true : disableBrowserSync;
    autoOpenBrowser = process.env.BROWSER === 'none' ? false : autoOpenBrowser;

    debug('disableBrowserSync', disableBrowserSync);
    debug('autoOpenBrowser', autoOpenBrowser);
    debug('isFirstCompile', isFirstCompile);

    if (disableBrowserSync || !isFirstCompile) return;

    if (browserSync.has(appName)) {
      chalk.red(`[BROWSER_SYNC] This project (${appName}) is using it.\n`);
      return;
    }

    bs = browserSync.create(appName || undefined);

    detect(DEFAULT_BROWSER_SYNC_PORT).then(
      port => {
        debug('localUrlForBrowser', urls.localUrlForBrowser);
        debug('BROWSER_SYNC_PORT', port);

        bs.init({
          open: autoOpenBrowser,
          // ui: false,
          notify: false,
          proxy: {
            target: urls.localUrlForBrowser,
            ws: true,
          },
          cwd,
          port,
        });

        if (onOpenPort) {
          const urls = prepareUrls(PROTOCOL, HOST, port);
          onOpenPort(
            {
              port,
              urls,
              appName,
              HOST,
              PROTOCOL,
            },
            'BROWSER_SYNC',
          );
        }
      },
      err => {
        chalk.red(
          `[BROWSER_SYNC] Could not find an open port.\nNetwork error message: ${err.message ||
            err}\n`,
        );
      },
    );

    isFirstCompile = false;
  }

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

  // get webpack config
  const webpackConfig = applyWebpackConfig(
    applyWebpack,
    getWebpackConfig(
      {
        cwd,
        config,
        babel,
        paths,
        entry,
      },
      applyConfig,
    ),
  );
  const {
    openBrowser: autoOpenBrowser = _cliEnv.BROWSER,
    disableBrowserSync = is.undefined(_cliEnv.BROWSER_SYNC)
      ? undefined
      : !_cliEnv.BROWSER_SYNC,
  } = config;

  dev({
    webpackConfig,
    userPKG,
    autoOpenBrowser,
    index: config.html && config.html.filename,
    port: config.port,
    proxy: config.proxy || {},
    historyApiFallback: config.historyApiFallback,
    beforeMiddleware(app) {
      // This service worker file is effectively a 'no-op' that will reset any
      // previous service worker registered for the same host:port combination.
      // We do this in development to avoid hitting the production cache if
      // it used the same host and port.
      // https://github.com/facebookincubator/create-react-app/issues/2272#issuecomment-302832432
      app.use(noopServiceWorkerMiddleware());
    },
    beforeServer(devServer) {
      try {
        applyMock(devServer);
      } catch (e) {
        console.log(e);
      }
    },
    afterServer(devServer, urlsInfo) {
      if (onOpenPort) {
        onOpenPort(urlsInfo, 'DEV_SERVER');
      }
      returnedWatchConfig(devServer);
    },
    onCompileDone({ urls, appName, HOST, PROTOCOL }) {
      if (isFirstCompile) {
        initBrowserSync({
          urls,
          appName,
          HOST,
          PROTOCOL,
          cwd,
          autoOpenBrowser,
          disableBrowserSync,
        });
        isFirstCompile = false;
      } else {
        bs && bs.active && bs.reload(); // eslint-disable-line
      }
    },
  });
}
