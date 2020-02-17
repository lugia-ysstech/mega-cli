import { argv } from 'yargs';

// 修复 Ctrl+C 时 dev server 没有正常退出的问题
process.on('SIGINT', () => {
  process.exit(1);
});

let entry;
if (argv._.length > 0) {
  [entry] = argv._;
}

process.env.NODE_ENV = 'development';
require('../utils/dev')({ entry, port: argv.port });
