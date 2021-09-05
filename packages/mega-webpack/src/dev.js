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
      const compiler = createCompiler({
        webpack,
        config: webpackConfig,
        appName,
        urls,
        useYarn: useYarn()
      });
      const serverConfig = {
        // index,
        // disableHostCheck: true,
        // compress: true,
        // clientLogLevel: 'none',
        hot: true,
        // quiet: true,
        headers: {
          'access-control-allow-origin': '*'
        },
        // publicPath: webpackConfig.output.publicPath,
        // watchOptions: webpackConfig.watchOptions || {
        //   ignored: /node_modules/
        // },
        historyApiFallback,
        // overlay: false,
        host: HOST,
        proxy,
        https: !!process.env.HTTPS
        // contentBase,

        // before(app) {
        //   if (beforeMiddleware) {
        //     beforeMiddleware(app, urlsInfo);
        //   } // This lets us open files from the runtime error overlay.
        //
        //
        //   app.use((0, _errorOverlayMiddleware.default)());
        // },
        //
        // after(app) {
        //   if (afterMiddleware) {
        //     afterMiddleware(app, urlsInfo);
        //   }
        // }
      };
      const devServer = new WebpackDevServer(serverConfig, compiler);

      devServer.listen(port, HOST, err => {
        if (err) {
          console.log(err);
          return;
        }
        if (beforeServer) {
          beforeServer(devServer, urlsInfo);
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
