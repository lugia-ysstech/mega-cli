import { resolve } from 'path';
import { realpathSync } from 'fs';
import {
  BUILD_APP_DIR,
  BUILD_LIB_DIR,
  PUBLIC_DIR,
  PKG_JSON,
  SRC_DIR,
  PAGES_DIR,
  COMPONENTS_DIR,
  ASSETS_DIR,
  MODELS_DIR,
  CONFIG_DIR,
  CONFIG_FILE_NAME
} from './constants';

function resolveOwn(relativePath) {
  return resolve(__dirname, relativePath);
}

export default function(cwd, src = SRC_DIR) {
  const appDirectory = realpathSync(cwd);
  const appSrc = resolveApp(src);
  const { appPages, appComponents, appAssets, appModels } = resolveSrc();

  function resolveApp(relativePath) {
    return resolve(appDirectory, relativePath);
  }

  function resolveSrc() {
    return {
      appPages: resolve(appSrc, PAGES_DIR),
      appComponents: resolve(appSrc, COMPONENTS_DIR),
      appAssets: resolve(appSrc, ASSETS_DIR),
      appModels: resolve(appSrc, MODELS_DIR)
    };
  }

  return {
    appDirectory,
    appBuild: resolveApp(BUILD_APP_DIR),
    libBuild: resolveApp(BUILD_LIB_DIR),
    appPublic: resolveApp(PUBLIC_DIR),
    appConfig: resolveApp(CONFIG_DIR),
    appPackageJson: resolveApp(PKG_JSON),
    appConfigFile: resolveApp(CONFIG_FILE_NAME),
    appSrc,
    appPages,
    appComponents,
    appAssets,
    appModels,
    appNodeModules: resolveApp('node_modules'),
    ownNodeModules: resolveOwn('../../node_modules'),
    resolveApp,
    resolveOwn
  };
}
