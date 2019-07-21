import openBrowser from '@lugia/mega-utils/lib/openBrowser';
import clearConsole from '@lugia/mega-utils/lib/clearConsole';
import {
  createCompiler,
  prepareUrls
} from '@lugia/mega-utils/lib/WebpackDevServerUtils';
import is from '@lugia/mega-utils/lib/is';
import useYarn from '@lugia/mega-utils/lib/useYarn';
import errorOverlayMiddleware from '@lugia/mega-utils/lib/errorOverlayMiddleware';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import chalk from 'chalk';
import send, { STARTING, COMPILING, DONE } from './send';
import choosePort from './choosePort';

const isInteractive = process.stdout.isTTY;
const DEFAULT_PORT = 8000;
const HOST = process.env.HOST || '0.0.0.0';
const PROTOCOL = process.env.HTTPS ? 'https' : 'http';
const noop = () => {};

export default function dev({
  webpackConfig,
  userPKG = {},
  contentBase = false,
  index,
  port: oPort,
  proxy,
  autoOpenBrowser = true,
  historyApiFallback = {
    disableDotRule: true
  },
  beforeMiddleware,
  afterMiddleware,
  beforeServer,
  afterServer,
  onCompileDone = noop,
  onCompileInvalid = noop
}) {
  process.env.NODE_ENV = 'development';
  if (!webpackConfig) {
    throw new Error('webpackConfig should be supplied.');
  }
  choosePort(parseInt(process.env.PORT, 10) || oPort || DEFAULT_PORT)
    .then(port => {
      if (port === null) {
        return;
      }

      const appName =
        is.object(userPKG) && is.string(userPKG.name)
          ? userPKG.name
          : 'Your App';
      const urls = prepareUrls(PROTOCOL, HOST, port);
      const urlsInfo = {
        port,
        urls,
        appName,
        HOST,
        PROTOCOL
      };
      const compiler = createCompiler(
        webpack,
        webpackConfig,
        appName,
        urls,
        useYarn()
      );

      // Webpack startup recompilation fix. Remove when @sokra fixes the bug.
      // https://github.com/webpack/webpack/issues/2983
      // https://github.com/webpack/watchpack/issues/25
      const timefix = 11000;
      compiler.plugin('watch-run', (watching, callback) => {
        watching.startTime += timefix; // eslint-disable-line
        callback();
      });
      compiler.plugin('done', stats => {
        send({ type: DONE });
        stats.startTime -= timefix; // eslint-disable-line
        onCompileDone(urlsInfo);
      });
      compiler.plugin('invalid', () => {
        send({ type: COMPILING });
        onCompileInvalid(urlsInfo);
      });
      const serverConfig = {
        index,
        disableHostCheck: true,
        compress: true,
        clientLogLevel: 'none',
        hot: true,
        quiet: true,
        headers: {
          'access-control-allow-origin': '*'
        },
        publicPath: webpackConfig.output.publicPath,
        watchOptions: {
          ignored: /node_modules/
        },
        historyApiFallback,
        overlay: false,
        host: HOST,
        proxy,
        https: !!process.env.HTTPS,
        contentBase,
        before(app) {
          if (beforeMiddleware) {
            beforeMiddleware(app, urlsInfo);
          }
          // This lets us open files from the runtime error overlay.
          app.use(errorOverlayMiddleware());
        },
        after(app) {
          if (afterMiddleware) {
            afterMiddleware(app, urlsInfo);
          }
        }
      };
      const devServer = new WebpackDevServer(compiler, serverConfig);

      if (beforeServer) {
        beforeServer(devServer, urlsInfo);
      }

      devServer.listen(port, HOST, err => {
        if (err) {
          console.log(err);
          return;
        }
        if (isInteractive) {
          clearConsole();
        }
        console.log(chalk.cyan('Starting the development server...\n'));
        if (autoOpenBrowser) {
          openBrowser(urls.localUrlForBrowser);
        }
        send({ type: STARTING });
        if (afterServer) {
          afterServer(devServer, urlsInfo);
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
}
