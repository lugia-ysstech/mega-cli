import os from 'os';

export default {
  disableCSSModules: true,
  cssModulesWithAffix: true,
  openBrowser: false,
  parallel: os.cpus().length,
  dllDependenciesIncludes: ['is'],
};
