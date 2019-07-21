import os from 'os';

export default {
  port: 9000,
  disableCSSModules: true,
  cssModulesWithAffix: true,
  openBrowser: false,
  parallel: os.cpus().length,
  dllDependenciesIncludes: ['is']
};
