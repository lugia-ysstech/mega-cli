#!/usr/bin/env node

const jest = require('../lib');

const args = process.argv.slice(2);

const watch = args.includes('-w') || args.includes('--watch');
const coverage = args.includes('--coverage');
const updateSnapshot = args.includes('-u') || args.includes('--updateSnapshot');
const clearCache = args.includes('--clearCache');
const showConfig = args.includes('--showConfig');
const debug = args.includes('--debug');

jest({
  watch,
  coverage,
  updateSnapshot,
  clearCache,
  showConfig,
  debug
}).catch(e => {
  console.log(e);
  process.exit(1);
});
